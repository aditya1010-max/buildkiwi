import { useEffect, useState } from "react";

import { getCurrentUser } from "../api/auth.api";
import type { User } from "../types/user";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();

        if (!cancelled) {
          setUser(currentUser);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to restore current user:", error);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    user,
    loading,
  };
}
