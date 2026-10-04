import { useState } from "react";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileTabs, {
  type ProfileTab,
} from "../../components/profile/ProfileTabs";
import ProfileGrid from "../../components/profile/ProfileGrid";

import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Loader from "../../components/ui/Loader";

import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useBookmarks } from "../../hooks/useBookmarks";
import { useLikedProjects } from "../../hooks/useLikedProjects";
import { useMyProjects } from "../../hooks/useMyProjects";
import { User } from "../../types/user";

export default function CurrentProfile() {
  const { projects: myProjects } = useMyProjects();
  const { bookmarks } = useBookmarks();
  const { likedProjects } = useLikedProjects();

  const [activeTab, setActiveTab] = useState<ProfileTab>("projects");

  const { user, loading } = useCurrentUser();
  const [profileUser, setProfileUser] = useState<User | null>(null);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <ErrorState
        title="Unable to load profile"
        message="Something went wrong while loading your profile."
      />
    );
  }

  const currentProfileUser = profileUser ?? user;

  return (
    <main className="profile-page">
      <ProfileHeader
        user={currentProfileUser}
        isOwnProfile={true}
        onSave={setProfileUser}
      />
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "projects" &&
        (myProjects.length > 0 ? (
          <ProfileGrid projects={myProjects} />
        ) : (
          <EmptyState
            icon="📂"
            title="No projects yet"
            message="You haven't published any projects yet. Start building something amazing."
            action={<Button>Create Project</Button>}
          />
        ))}

      {activeTab === "saved" &&
        (bookmarks.length > 0 ? (
          <ProfileGrid projects={bookmarks} />
        ) : (
          <EmptyState
            icon="🔖"
            title="No saved projects yet"
            message="Projects you save will appear here."
            action={<Button>Explore Projects</Button>}
          />
        ))}

      {activeTab === "likes" &&
        (likedProjects.length > 0 ? (
          <ProfileGrid projects={likedProjects} />
        ) : (
          <EmptyState
            icon="♥"
            title="No liked projects yet"
            message="Projects you like will appear here."
            action={<Button>Explore Projects</Button>}
          />
        ))}
    </main>
  );
}
