import "./ProjectSection.css";
import { ReactNode } from "react";

interface ProjectSectionProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function ProjectSection({
  title,
  children,
  actions,
}: ProjectSectionProps) {
  return (
    <section className="project-section">
      <header className="project-section__header">
        <h2 className="project-section__title">{title}</h2>

        {actions && <div className="project-section__actions">{actions}</div>}
      </header>

      <div className="project-section__body">{children}</div>
    </section>
  );
}
