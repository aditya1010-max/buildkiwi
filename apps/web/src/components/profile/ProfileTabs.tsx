import "./ProfileTabs.css";

export type ProfileTab = "projects" | "saved" | "likes";

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export default function ProfileTabs({
  activeTab,
  onTabChange,
}: ProfileTabsProps) {
  return (
    <nav className="profile-tabs">
      <button
        className={activeTab === "projects" ? "active" : ""}
        onClick={() => onTabChange("projects")}
      >
        Projects
      </button>

      <button
        className={activeTab === "saved" ? "active" : ""}
        onClick={() => onTabChange("saved")}
      >
        Saved
      </button>

      <button
        className={activeTab === "likes" ? "active" : ""}
        onClick={() => onTabChange("likes")}
      >
        Likes
      </button>
    </nav>
  );
}
