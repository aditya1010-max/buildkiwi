import type { ReactNode } from "react";
import "./ProjectDetailsLayout.css";

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
      <main className="project-details-layout_content">{content}</main>

      <aside className="project-details-layout_sidebar">{sidebar}</aside>
    </section>
  );
}
