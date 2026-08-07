import { Navigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

export default function WelcomeRedirect() {
  const { getToken } = useAuth();

  return <Navigate to={getToken() ? "/home" : "/welcome"} replace />;
}
