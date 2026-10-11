import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { getCurrentUser } from "../../api/auth.api";

export default function ProtectedRoute() {
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(() =>
    Boolean(localStorage.getItem("token")),
  );

  const [checkingSession, setCheckingSession] = useState(
    () => !localStorage.getItem("token"),
  );

  useEffect(() => {
    if (localStorage.getItem("token")) {
      return;
    }

    let cancelled = false;

    async function restoreSession() {
      try {
        const user = await getCurrentUser();

        if (!cancelled) {
          setAuthenticated(Boolean(user));
        }
      } finally {
        if (!cancelled) {
          setCheckingSession(false);
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  if (checkingSession) {
    return null;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
