import { getFeedRepository } from "../repositories/feed.repository";

export const getFeedService = async (page: number, limit: number) => {
  return await getFeedRepository(page, limit);
};
