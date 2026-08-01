import { useProgressContext } from "../providers/ProgressProvider";

export function useProgress() {
  return useProgressContext();
}