import { searchProjectsRepository } from "../repositories/search.repository";

export const searchProjectsService = async (
  query: string,
  page: number,
  limit: number,
) => {
  return await searchProjectsRepository(query, page, limit);
};
