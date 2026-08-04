import "./ProfilePage.css";

import { useState } from "react";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileTabs, {
  type ProfileTab,
} from "../../components/profile/ProfileTabs";
import ProfileGrid from "../../components/profile/ProfileGrid";
import EmptyProfile from "../../components/profile/EmptyProfile";

import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useSavedProjects } from "../../hooks/useSavedProjects";
import { useBookmarks } from "../../hooks/useBookmarks";
import { useLikedProjects } from "../../hooks/useLikedProjects";

export default function ProfilePage() {
  const { projects: myProjects } = useSavedProjects();
  const { bookmarks } = useBookmarks();
  const { likedProjects } = useLikedProjects();

  const [activeTab, setActiveTab] = useState<ProfileTab>("projects");

  const { user, loading } = useCurrentUser();

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return <p>Unable to load profile.</p>;
  }

  return (
    <main className="profile-page">
      <ProfileHeader user={user} />

      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "projects" &&
        (myProjects.length > 0 ? (
          <ProfileGrid projects={myProjects} />
        ) : (
          <EmptyProfile isCurrentUser />
        ))}

      {activeTab === "saved" &&
        (bookmarks.length > 0 ? (
          <ProfileGrid projects={bookmarks} />
        ) : (
          <EmptyProfile isCurrentUser />
        ))}

      {activeTab === "likes" &&
        (likedProjects.length > 0 ? (
          <ProfileGrid projects={likedProjects} />
        ) : (
          <EmptyProfile isCurrentUser />
        ))}
    </main>
  );
}
