import { createContext } from "react";

export interface ProgressContextValue {
  activeTasks: number;
}

export const ProgressContext = createContext<ProgressContextValue>({
  activeTasks: 0,
});
