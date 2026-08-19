import { useEffect, useState, type ReactNode } from "react";

import { ProgressContext } from "./ProgressContext";
import { subscribe } from "../services/progressBarManager";

interface ProgressProviderProps {
  children: ReactNode;
}

export function ProgressProvider({ children }: ProgressProviderProps) {
  const [activeTasks, setActiveTasks] = useState(0);

  useEffect(() => subscribe(setActiveTasks), []);

  return (
    <ProgressContext.Provider value={{ activeTasks }}>
      {children}
    </ProgressContext.Provider>
  );
}
