import { createContext } from "react";

export interface LikeContextType {
  loading: boolean;
  likedIds: Set<string>;
  loadingLikes: boolean;
  isPending: (projectId: string) => boolean;
  isLiked: (projectId: string) => boolean;
  addLike: (projectId: string) => Promise<void>;
  removeLike: (projectId: string) => Promise<void>;
  toggleLike: (projectId: string) => Promise<boolean>;
}

export const LikeContext = createContext<LikeContextType | null>(null);
