import { useEffect, useState } from "react";

import { getUserProfile } from "../api/user.api";
import type { User } from "../types/user";

export function useUserProfile(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const profile = await getUserProfile(id);
        setUser(profile);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id]);

  return {
    user,
    loading,
  };
}
