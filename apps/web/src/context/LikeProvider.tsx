import { useCallback, useEffect, useMemo, useState } from "react";

import {
  addLike as addLikeRequest,
  removeLike as removeLikeRequest,
  getLikes,
} from "../api/like.api";

import { getAccessToken } from "../utils/token";

import { LikeContext } from "./LikeContext";

export function LikeProvider({ children }: { children: React.ReactNode }) {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const [loadingLikes, setLoadingLikes] = useState(() =>
    Boolean(getAccessToken()),
  );

  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!getAccessToken()) {
      return;
    }

    const loadLikes = async () => {
      try {
        const projects = await getLikes();

        setLikedIds(
          new Set(
            projects
              .filter((project): project is { _id: string } =>
                Boolean(project && project._id),
              )
              .map((project) => project._id),
          ),
        );
      } catch (error) {
        console.error("Failed to load likes:", error);
      } finally {
        setLoadingLikes(false);
      }
    };

    loadLikes();
  }, []);

  const setPending = useCallback((projectId: string, isPending: boolean) => {
    setPendingIds((prev) => {
      const next = new Set(prev);

      if (isPending) {
        next.add(projectId);
      } else {
        next.delete(projectId);
      }

      return next;
    });
  }, []);

  const addLikeOptimistic = useCallback(
    async (projectId: string) => {
      setPending(projectId, true);

      setLikedIds((prev) => new Set(prev).add(projectId));

      try {
        await addLikeRequest(projectId);
      } catch (error) {
        console.error("Failed to add like:", error);

        setLikedIds((prev) => {
          const next = new Set(prev);
          next.delete(projectId);
          return next;
        });
      } finally {
        setPending(projectId, false);
      }
    },
    [setPending],
  );

  const removeLikeOptimistic = useCallback(
    async (projectId: string) => {
      setPending(projectId, true);

      setLikedIds((prev) => {
        const next = new Set(prev);
        next.delete(projectId);
        return next;
      });

      try {
        await removeLikeRequest(projectId);
      } catch (error) {
        console.error("Failed to remove like:", error);

        setLikedIds((prev) => new Set(prev).add(projectId));
      } finally {
        setPending(projectId, false);
      }
    },
    [setPending],
  );

  const toggleLike = useCallback(
    async (projectId: string) => {
      if (pendingIds.has(projectId)) {
        return;
      }

      if (likedIds.has(projectId)) {
        await removeLikeOptimistic(projectId);
      } else {
        await addLikeOptimistic(projectId);
      }
    },
    [likedIds, pendingIds, addLikeOptimistic, removeLikeOptimistic],
  );

  const isLiked = useCallback(
    (projectId: string) => likedIds.has(projectId),
    [likedIds],
  );

  const isPending = useCallback(
    (projectId: string) => pendingIds.has(projectId),
    [pendingIds],
  );

  const value = useMemo(
    () => ({
      loading: loadingLikes,
      likedIds,
      loadingLikes,
      isLiked,
      isPending,
      addLike: addLikeOptimistic,
      removeLike: removeLikeOptimistic,
      toggleLike,
    }),
    [
      likedIds,
      loadingLikes,
      isLiked,
      isPending,
      addLikeOptimistic,
      removeLikeOptimistic,
      toggleLike,
    ],
  );

  return <LikeContext.Provider value={value}>{children}</LikeContext.Provider>;
}
