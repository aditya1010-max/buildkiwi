import { useContext } from "react";

import { BookmarkContext } from "./BookmarkContext";

export function useBookmarkContext() {
  const context = useContext(BookmarkContext);

  if (!context) {
    throw new Error("useBookmarkContext must be used inside BookmarkProvider");
  }

  return context;
}
