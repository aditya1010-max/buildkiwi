import type { ReactNode } from "react";

import Section from "../../ui/Section";

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
    <Section title={title} actions={actions}>
      {children}
    </Section>
  );
}
