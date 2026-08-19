import { createContext } from "react";

export interface BookmarkContextType {
  loading: boolean;
  bookmarkedIds: Set<string>;
  loadingBookmarks: boolean;
  isPending: (projectId: string) => boolean;
  isBookmarked: (projectId: string) => boolean;
  addBookmark: (projectId: string) => Promise<void>;
  removeBookmark: (projectId: string) => Promise<void>;
  toggleBookmark: (projectId: string) => Promise<void>;
}

export const BookmarkContext = createContext<BookmarkContextType | null>(null);
