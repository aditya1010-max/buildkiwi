import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";

export default function EmptySaved(): ReactElement {
  return (
    <EmptyState
      icon="🔖"
      title="No saved projects yet"
      message="Projects you save will appear here."
      action={
        <Link to="/discover">
          <Button>Explore Projects</Button>
        </Link>
      }
    />
  );
}
