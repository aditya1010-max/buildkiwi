import { useContext } from "react";

import { LikeContext } from "./LikeContext";

export function useLikeContext() {
  const context = useContext(LikeContext);

  if (!context) {
    throw new Error("useLikeContext must be used inside LikeProvider");
  }

  return context;
}
