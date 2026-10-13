import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

  // A synchronous lock prevents duplicate operations before React rerenders.
  const inFlightRef = useRef(new Set<string>());

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

    void loadLikes();
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
    async (projectId: string): Promise<boolean> => {
      if (inFlightRef.current.has(projectId)) {
        return false;
      }

      inFlightRef.current.add(projectId);
      setPending(projectId, true);
      setLikedIds((prev) => new Set(prev).add(projectId));

      try {
        await addLikeRequest(projectId);
        return true;
      } catch (error) {
        console.error("Failed to add like:", error);

        setLikedIds((prev) => {
          const next = new Set(prev);
          next.delete(projectId);
          return next;
        });

        return false;
      } finally {
        inFlightRef.current.delete(projectId);
        setPending(projectId, false);
      }
    },
    [setPending],
  );

  const removeLikeOptimistic = useCallback(
    async (projectId: string): Promise<boolean> => {
      if (inFlightRef.current.has(projectId)) {
        return false;
      }

      inFlightRef.current.add(projectId);
      setPending(projectId, true);

      setLikedIds((prev) => {
        const next = new Set(prev);
        next.delete(projectId);
        return next;
      });

      try {
        await removeLikeRequest(projectId);
        return true;
      } catch (error) {
        console.error("Failed to remove like:", error);

        setLikedIds((prev) => new Set(prev).add(projectId));
        return false;
      } finally {
        inFlightRef.current.delete(projectId);
        setPending(projectId, false);
      }
    },
    [setPending],
  );

  const addLike = useCallback(
    async (projectId: string): Promise<void> => {
      await addLikeOptimistic(projectId);
    },
    [addLikeOptimistic],
  );

  const removeLike = useCallback(
    async (projectId: string): Promise<void> => {
      await removeLikeOptimistic(projectId);
    },
    [removeLikeOptimistic],
  );

  const toggleLike = useCallback(
    async (projectId: string): Promise<boolean> => {
      // This check is synchronous, unlike checking pendingIds state alone.
      if (inFlightRef.current.has(projectId)) {
        return false;
      }

      if (likedIds.has(projectId)) {
        return removeLikeOptimistic(projectId);
      }

      return addLikeOptimistic(projectId);
    },
    [likedIds, addLikeOptimistic, removeLikeOptimistic],
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
      addLike,
      removeLike,
      toggleLike,
    }),
    [
      likedIds,
      loadingLikes,
      isLiked,
      isPending,
      addLike,
      removeLike,
      toggleLike,
    ],
  );

  return <LikeContext.Provider value={value}>{children}</LikeContext.Provider>;
}
