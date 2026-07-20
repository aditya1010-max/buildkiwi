import { AppError } from "../utils/AppError";

import { bookmarkRepository } from "../repositories/bookmark.repository";
import { projectRepository } from "../repositories/project.repository";

export async function addBookmarkService(userId: string, projectId: string) {
  const project = await projectRepository.findById(projectId);

  if (!project) {
    throw new AppError("Project not found.", 404);
  }

  const existingBookmark = await bookmarkRepository.find(userId, projectId);

  if (existingBookmark) {
    throw new AppError("Project already bookmarked.", 409);
  }

  return bookmarkRepository.create(userId, projectId);
}

export async function removeBookmarkService(userId: string, projectId: string) {
  const bookmark = await bookmarkRepository.delete(userId, projectId);

  if (!bookmark) {
    throw new AppError("Bookmark not found.", 404);
  }

  return bookmark;
}

export async function getBookmarksService(userId: string) {
  const bookmarks = await bookmarkRepository.findByUserId(userId);

  return bookmarks.map((bookmark: any) => bookmark.projectId);
}
