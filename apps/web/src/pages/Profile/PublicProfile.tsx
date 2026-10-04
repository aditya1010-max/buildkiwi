import { useState } from "react";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileGrid from "../../components/profile/ProfileGrid";

import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Loader from "../../components/ui/Loader";

import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useUserProjects } from "../../hooks/useUserProjects";

export interface PublicProfileProps {
  username: string;
}

export default function PublicProfile({ username }: PublicProfileProps) {
  const { user, loading: userLoading } = useUserProfile(username);
  const { projects, loading: projectsLoading } = useUserProjects(username);
  const { user: currentUser } = useCurrentUser();

  const [profileUser, setProfileUser] = useState<typeof user>(null);

  const currentProfileUser = profileUser ?? user;

  if (userLoading || projectsLoading) {
    return <Loader />;
  }

  if (!currentProfileUser) {
    return (
      <ErrorState
        title="Unable to load profile"
        message="This profile could not be found."
      />
    );
  }

  const isOwnProfile =
    currentUser !== null && currentUser.id === currentProfileUser.id;

  return (
    <main className="profile-page">
      <ProfileHeader
        user={currentProfileUser}
        isOwnProfile={isOwnProfile}
        onSave={setProfileUser}
      />

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
