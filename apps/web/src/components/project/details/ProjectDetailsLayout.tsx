import { ReactNode } from "react";
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
      <main className="project-details-layout__content">{content}</main>

      <aside className="project-details-layout__sidebar">{sidebar}</aside>
    </section>
  );
}
