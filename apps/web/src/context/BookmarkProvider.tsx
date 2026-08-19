import { useCallback, useEffect, useMemo, useState } from "react";

import {
  addBookmark as addBookmarkRequest,
  removeBookmark as removeBookmarkRequest,
  getBookmarks,
} from "../api/bookmark.api";
import { getAccessToken } from "../utils/token";
import { useToast } from "../hooks/useToast";

import { BookmarkContext } from "./BookmarkContext";

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const [loadingBookmarks, setLoadingBookmarks] = useState(
    Boolean(getAccessToken()),
  );

  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const toast = useToast();

  useEffect(() => {
    const token = getAccessToken();

    if (!token) return;

    const loadBookmarks = async () => {
      try {
        const response = await getBookmarks();

        const ids = new Set<string>(
          response.projects
            .filter((project: { _id: string } | null) => project !== null)
            .map((project: { _id: string }) => project._id),
        );

        setBookmarkedIds(ids);
      } catch (error) {
        console.error("Failed to load bookmarks", error);
      } finally {
        setLoadingBookmarks(false);
      }
    };

    loadBookmarks();
  }, []);

  const setPending = (projectId: string, isPending: boolean) => {
    setPendingIds((prev) => {
      const next = new Set(prev);

      if (isPending) {
        next.add(projectId);
      } else {
        next.delete(projectId);
      }

      return next;
    });
  };

  const addBookmarkOptimistic = useCallback(async (projectId: string) => {
    setPending(projectId, true);

    setBookmarkedIds((prev) => new Set(prev).add(projectId));

    try {
      await addBookmarkRequest(projectId);
    } catch (error) {
      console.error("Failed to add bookmark:", error);

      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        next.delete(projectId);
        return next;
      });
    } finally {
      setPending(projectId, false);
    }
  }, []);

  const removeBookmarkOptimistic = useCallback(async (projectId: string) => {
    setPending(projectId, true);

    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      next.delete(projectId);
      return next;
    });

    try {
      await removeBookmarkRequest(projectId);
    } catch (error) {
      console.error("Failed to remove bookmark:", error);

      setBookmarkedIds((prev) => new Set(prev).add(projectId));
    } finally {
      setPending(projectId, false);
    }
  }, []);

  const toggleBookmark = useCallback(
    async (projectId: string) => {
      if (!getAccessToken()) {
        toast.info("Sign in required", "Sign in to save projects.");

        return;
      }

      if (bookmarkedIds.has(projectId)) {
        await removeBookmarkOptimistic(projectId);
      } else {
        await addBookmarkOptimistic(projectId);
      }
    },
    [bookmarkedIds, addBookmarkOptimistic, removeBookmarkOptimistic, toast],
  );

  const isBookmarked = useCallback(
    (projectId: string) => bookmarkedIds.has(projectId),
    [bookmarkedIds],
  );

  const isPending = useCallback(
    (projectId: string) => pendingIds.has(projectId),
    [pendingIds],
  );

  const value = useMemo(
    () => ({
      loading: loadingBookmarks,
      bookmarkedIds,
      loadingBookmarks,
      isBookmarked,
      isPending,
      addBookmark: addBookmarkOptimistic,
      removeBookmark: removeBookmarkOptimistic,
      toggleBookmark,
    }),
    [
      bookmarkedIds,
      loadingBookmarks,
      isBookmarked,
      isPending,
      addBookmarkOptimistic,
      removeBookmarkOptimistic,
      toggleBookmark,
    ],
  );

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}
