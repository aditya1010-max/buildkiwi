import { useContext } from "react";

import { ProgressContext } from "./ProgressContext";

export function useProgressContext() {
  return useContext(ProgressContext);
}
