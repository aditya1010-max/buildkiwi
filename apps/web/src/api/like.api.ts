import api from "../services/api";

export interface LikedProject {
  _id: string;
}

export async function getLikes(): Promise<LikedProject[]> {
  const response = await api.get("/likes");
  return response.data.data;
}

export async function addLike(projectId: string): Promise<LikedProject> {
  const response = await api.post(`/likes/${projectId}`);
  return response.data.data;
}

export async function removeLike(projectId: string): Promise<void> {
  await api.delete(`/likes/${projectId}`);
}
