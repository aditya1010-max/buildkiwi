import type { ReactElement } from "react";

import Button from "../../ui/Button";
import EmptyState from "../../ui/EmptyState";

interface EmptyProjectsProps {
  onCreateProject?: () => void;
}

export default function EmptyProjects({
  onCreateProject,
}: EmptyProjectsProps): ReactElement {
  return (
    <EmptyState
      icon="📂"
      title="No projects yet"
      message="You haven't created any projects yet. Start building your first project and showcase it to the community."
      action={
        onCreateProject ? (
          <Button onClick={onCreateProject}>Create Project</Button>
        ) : undefined
      }
    />
  );
}
