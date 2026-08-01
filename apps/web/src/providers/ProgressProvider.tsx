import { createContext, useContext, useEffect, useState } from "react";

import { subscribe } from "../services/progressBarManager";

interface ProgressContextValue {
  activeTasks: number;
}

const ProgressContext = createContext<ProgressContextValue>({
  activeTasks: 0,
});

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [activeTasks, setActiveTasks] = useState(0);

  useEffect(() => subscribe(setActiveTasks), []);

  return (
    <ProgressContext.Provider value={{ activeTasks }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgressContext() {
  return useContext(ProgressContext);
}
