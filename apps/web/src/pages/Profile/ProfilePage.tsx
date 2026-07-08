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

export default function ProfilePage() {
  const { projects: savedProjects } = useSavedProjects();
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
        (savedProjects.length > 0 ? (
          <ProfileGrid projects={savedProjects} />
        ) : (
          <EmptyProfile isCurrentUser />
        ))}

      {activeTab === "saved" && <EmptyProfile />}

      {activeTab === "likes" && <EmptyProfile />}
    </main>
  );
}
