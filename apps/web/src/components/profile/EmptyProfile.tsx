import type { ReactElement } from "react";

import { AddFolderIcon } from "../../assets/icons/ProjectCardIcons";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";

interface EmptyProfileProps {
  isCurrentUser?: boolean;
  onCreateProject?: () => void;
}

export default function EmptyProfile({
  isCurrentUser = false,
  onCreateProject,
}: EmptyProfileProps): ReactElement {
  return (
    <EmptyState
      icon={<AddFolderIcon size={64} />}
      title="No projects yet"
      message={
        isCurrentUser
          ? "You haven't published any projects yet. Start building something amazing."
          : "This user hasn't published any projects yet."
      }
      action={
        isCurrentUser && onCreateProject ? (
          <Button onClick={onCreateProject}>Create Project</Button>
        ) : undefined
      }
    />
  );
}
