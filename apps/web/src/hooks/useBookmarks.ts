import { useCallback, useEffect, useState } from "react";
import { addBookmark, getBookmarks, removeBookmark } from "../api/bookmark.api";
import type { Project } from "../types/project";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Project[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [pendingIds, setPendingIds] = useState<Set<string>>(() => new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getBookmarks();

      const projects: Project[] = (data.projects ?? []).filter(
        (project: Project | null): project is Project => project !== null,
      );

      setBookmarks(projects);
      setBookmarkedIds(new Set(projects.map((project) => project._id)));
    } catch (err) {
      console.error("Failed to load bookmarks:", err);
      setError("Failed to load bookmarks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadBookmarks() {
      try {
        const data = await getBookmarks();

        if (!cancelled) {
          const projects: Project[] = (data.projects ?? []).filter(
            (project: Project | null): project is Project => project !== null,
          );

          setBookmarks(projects);
          setBookmarkedIds(new Set(projects.map((project) => project._id)));
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load bookmarks:", err);
          setError("Failed to load bookmarks.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadBookmarks();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleBookmark = useCallback(
    async (project: Project): Promise<void> => {
      const projectId = project._id;

      if (pendingIds.has(projectId)) {
        return;
      }

      const isBookmarked = bookmarkedIds.has(projectId);

      setPendingIds((current) => {
        const next = new Set(current);
        next.add(projectId);
        return next;
      });

      try {
        if (isBookmarked) {
          await removeBookmark(projectId);

          setBookmarkedIds((current) => {
            const next = new Set(current);
            next.delete(projectId);
            return next;
          });
        } else {
          await addBookmark(projectId);

          setBookmarkedIds((current) => {
            const next = new Set(current);
            next.add(projectId);
            return next;
          });
        }
      } catch (err) {
        console.error("Failed to update bookmark:", err);
      } finally {
        setPendingIds((current) => {
          const next = new Set(current);
          next.delete(projectId);
          return next;
        });
      }
    },
    [bookmarkedIds, pendingIds],
  );

  return {
    bookmarks,
    bookmarkedIds,
    pendingIds,
    loading,
    error,
    toggleBookmark,
    refetch: fetchBookmarks,
  };
}
