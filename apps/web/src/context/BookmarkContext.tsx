import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  addBookmark as addBookmarkRequest,
  removeBookmark as removeBookmarkRequest,
  getBookmarks,
} from "../api/bookmark.api";
import { getAccessToken } from "../utils/token";

import { useToast } from "../hooks/useToast";

interface BookmarkContextType {
  loading: boolean;
  bookmarkedIds: Set<string>;
  loadingBookmarks: boolean;
  isPending: (projectId: string) => boolean;
  isBookmarked: (projectId: string) => boolean;
  addBookmark: (projectId: string) => Promise<void>;
  removeBookmark: (projectId: string) => Promise<void>;
  toggleBookmark: (projectId: string) => Promise<void>;
}

const BookmarkContext = createContext<BookmarkContextType | null>(null);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const toast = useToast();

  console.count("BookmarkProvider mounted");
  useEffect(() => {
    const token = getAccessToken();

    // Guest users don't have bookmarks.
    if (!token) {
      setLoadingBookmarks(false);
      return;
    }
    const loadBookmarks = async () => {
      try {
        const response = await getBookmarks();

        const ids = new Set<string>(
          response.projects.map((project: { _id: string }) => project._id),
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

  // Helper to safely modify pending IDs state
  const setPending = (projectId: string, isPending: boolean) => {
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (isPending) next.add(projectId);
      else next.delete(projectId);
      return next;
    });
  };

  const addBookmarkOptimistic = useCallback(async (projectId: string) => {
    setPending(projectId, true);

    // Optimistically add
    setBookmarkedIds((prev) => new Set(prev).add(projectId));

    try {
      await addBookmarkRequest(projectId);
    } catch (error) {
      console.error("Failed to add bookmark:", error);
      // ROLLBACK: Remove if request fails
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        next.delete(projectId);
        return next;
      });
    } finally {
      setPending(projectId, false);
    }
  }, []); // No external state dependencies needed!

  const removeBookmarkOptimistic = useCallback(async (projectId: string) => {
    setPending(projectId, true);

    // Optimistically remove
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      next.delete(projectId);
      return next;
    });

    try {
      await removeBookmarkRequest(projectId);
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
      // ROLLBACK: Re-add if request fails
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
    [bookmarkedIds, addBookmarkOptimistic, removeBookmarkOptimistic],
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

export function useBookmarkContext() {
  const context = useContext(BookmarkContext);

  if (!context) {
    throw new Error("useBookmarkContext must be used inside BookmarkProvider");
  }

  return context;
}
