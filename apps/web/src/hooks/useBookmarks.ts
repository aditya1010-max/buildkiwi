import { useCallback, useEffect, useState } from "react";

import { getBookmarks } from "../services/bookmark.service";
import type { Project } from "../types/project";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getBookmarks();

      setBookmarks(data.projects);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookmarks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialBookmarks() {
      try {
        const data = await getBookmarks();

        if (!cancelled) {
          setBookmarks(data.projects);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("Failed to load bookmarks.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialBookmarks();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    bookmarks,
    loading,
    error,
    refetch: fetchBookmarks,
  };
}
