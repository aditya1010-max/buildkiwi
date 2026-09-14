import "./ProfileTabs.css";

export type ProfileTab = "projects" | "saved" | "likes";

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

const tabs: {
  label: string;
  value: ProfileTab;
}[] = [
  { label: "Projects", value: "projects" },
  { label: "Saved", value: "saved" },
  { label: "Likes", value: "likes" },
];

export default function ProfileTabs({
  activeTab,
  onTabChange,
}: ProfileTabsProps) {
  return (
    <nav className="profile-tabs" aria-label="Profile sections">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            className={
              isActive
                ? "profile-tabs__tab profile-tabs__tab--active"
                : "profile-tabs__tab"
            }
            onClick={() => onTabChange(tab.value)}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
