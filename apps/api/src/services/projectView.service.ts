import {
  createProjectView,
  findLatestProjectView,
} from "../repositories/projectView.repository";
import { incrementProjectViews } from "../repositories/projectView.repository";

export async function recordProjectView(projectId: string, visitorId: string) {
  const latestView = await findLatestProjectView(projectId, visitorId);

  if (latestView) {
    const VIEW_COOLDOWN_MS = 24 * 60 * 60 * 1000;

    const hasRecentView =
      Date.now() - latestView.viewedAt.getTime() < VIEW_COOLDOWN_MS;

    if (hasRecentView) {
      return;
    }
  }

  await createProjectView(projectId, visitorId);

  await incrementProjectViews(projectId);
}
