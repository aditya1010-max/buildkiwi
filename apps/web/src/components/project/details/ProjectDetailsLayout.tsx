import { ReactNode } from "react";

interface ProjectDetailsLayoutProps {
  content: ReactNode;
  sidebar: ReactNode;
}

export default function ProjectDetailsLayout({
  content,
  sidebar,
}: ProjectDetailsLayoutProps) {
  return (
    <section className="project-details-layout">
      <div className="project-details-layout__content">{content}</div>

      <aside className="project-details-layout__sidebar">{sidebar}</aside>
    </section>
  );
}
