import "./ProfilePage.css";

import { useParams } from "react-router-dom";

import CurrentProfile from "./CurrentProfile";
import PublicProfile from "./PublicProfile";
import { useCurrentUser } from "../../hooks/useCurrentUser";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user, loading } = useCurrentUser();

  if (loading) {
    return null;
  }

  // /profile
  if (!username) {
    return <CurrentProfile />;
  }

  // /profile/:username
  // If this is the logged-in user's username,
  // render the private/current profile with tabs.
  if (user?.username === username) {
    return <CurrentProfile />;
  }

  // Otherwise this is somebody else's public profile.
  return <PublicProfile username={username} />;
}
