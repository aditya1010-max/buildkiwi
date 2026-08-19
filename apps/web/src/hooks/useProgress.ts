import { useProgressContext } from "../providers/useProgressContext";

export function useProgress() {
  return useProgressContext();
}
