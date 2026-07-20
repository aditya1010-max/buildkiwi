import api from "../services/api";

export async function getBookmarks() {
  const { data } = await api.get("/bookmarks");
  return data;
}

export async function addBookmark(projectId: string) {
  const { data } = await api.post(`/bookmarks/${projectId}`);
  return data;
}

export async function removeBookmark(projectId: string) {
  const { data } = await api.delete(`/bookmarks/${projectId}`);
  return data;
}
