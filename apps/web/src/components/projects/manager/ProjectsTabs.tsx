import "./ProjectsTabs.css";

import type { ReactElement } from "react";

export type ProjectsTab = "published" | "drafts" | "archived";

interface ProjectsTabsProps {
  activeTab: ProjectsTab;
  onTabChange: (tab: ProjectsTab) => void;
}

const tabs: {
  label: string;
  value: ProjectsTab;
}[] = [
  {
    label: "Published",
    value: "published",
  },
  {
    label: "Drafts",
    value: "drafts",
  },
  {
    label: "Archived",
    value: "archived",
  },
];

export default function ProjectsTabs({
  activeTab,
  onTabChange,
}: ProjectsTabsProps): ReactElement {
  return (
    <nav className="projects-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={
            activeTab === tab.value
              ? "projects-tabs_button projects-tabs_button--active"
              : "projects-tabs_button"
          }
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
