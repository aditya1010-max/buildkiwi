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
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarks,
    loading,
    error,
    refetch: fetchBookmarks,
  };
}
