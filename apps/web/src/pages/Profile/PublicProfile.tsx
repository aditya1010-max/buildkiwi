import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileGrid from "../../components/profile/ProfileGrid";

import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Loader from "../../components/ui/Loader";

import { useUserProfile } from "../../hooks/useUserProfile";
import { useUserProjects } from "../../hooks/useUserProjects";

interface PublicProfileProps {
  username: string;
}

export default function PublicProfile({ username }: PublicProfileProps) {
  console.log("🔥 PUBLIC PROFILE RENDERED:", username);
  const { user, loading: userLoading } = useUserProfile(username);
  const { projects, loading: projectsLoading } = useUserProjects(username);

  if (userLoading || projectsLoading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <ErrorState
        title="Unable to load profile"
        message="This profile could not be found."
      />
    );
  }

  return (
    <main className="profile-page">
      <ProfileHeader user={user} />

      {projects.length > 0 ? (
        <ProfileGrid projects={projects} />
      ) : (
        <EmptyState
          icon="📂"
          title="No projects yet"
          message="This user hasn't published any projects yet."
        />
      )}
    </main>
  );
}
