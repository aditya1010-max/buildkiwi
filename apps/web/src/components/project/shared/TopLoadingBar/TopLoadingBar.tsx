import { useProgress } from "../../../../hooks/useProgress";

import "./TopLoadingBar.css";

export default function TopLoadingBar() {
  const { activeTasks } = useProgress();

  if (activeTasks === 0) {
    return null;
  }

  return <div className="top-loading-bar" />;
}