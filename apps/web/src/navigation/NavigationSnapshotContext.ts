import { createContext } from "react";

import type { ViewSnapshot } from "./snapshot-types";

export type ViewSnapshotData = {
  state?: Record<string, unknown>;
};

export type ViewSnapshotRegistration = {
  id: string;

  capture: () => ViewSnapshotData;

  restore: (snapshot: ViewSnapshot) => void | Promise<void>;
};

export type NavigationSnapshotContextValue = {
  register: (registration: ViewSnapshotRegistration) => () => void;

  capture: () => ViewSnapshotData | null;

  restore: (snapshot: ViewSnapshot) => void;
};

export const NavigationSnapshotContext =
  createContext<NavigationSnapshotContextValue | null>(null);
