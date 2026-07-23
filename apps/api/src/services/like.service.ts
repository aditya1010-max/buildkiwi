import { AppError } from "../utils/AppError";
import { likeRepository } from "../repositories/like.repository";
import { projectRepository } from "../repositories/project.repository";

export async function addLikeService(userId: string, projectId: string) {
  const existingLike = await likeRepository.find(userId, projectId);

  if (existingLike) {
    throw new AppError("Project already liked.", 409);
  }

  const project = await projectRepository.findByIdForUpdate(projectId);

  if (!project) {
    throw new AppError("Project not found.", 404);
  }

  const like = await likeRepository.create(userId, projectId);

  const currentLikes = project.get("stats.likes") ?? 0;
  project.set("stats.likes", currentLikes + 1);

  await project.save();

  return like;
}

export async function removeLikeService(userId: string, projectId: string) {
  const like = await likeRepository.delete(userId, projectId);

  if (!like) {
    throw new AppError("Like not found.", 404);
  }

  const project = await projectRepository.findByIdForUpdate(projectId);

  if (!project) {
    throw new AppError("Project not found.", 404);
  }

  const currentLikes = project.get("stats.likes") ?? 0;

  if (currentLikes > 0) {
    project.set("stats.likes", currentLikes - 1);
    await project.save();
  }

  return like;
}

export async function getLikesService(userId: string) {
  const likes = await likeRepository.findByUserId(userId);

  return likes.map((like) => like.projectId);
}
