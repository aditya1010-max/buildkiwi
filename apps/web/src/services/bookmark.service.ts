import api from "./api";

export async function getBookmarks() {
  const response = await api.get("/bookmarks");

  return response.data;
}

export async function addBookmark(projectId: string) {
  const response = await api.post(`/bookmarks/${projectId}`);

  return response.data;
}

export async function removeBookmark(projectId: string) {
  const response = await api.delete(`/bookmarks/${projectId}`);

  return response.data;
}
