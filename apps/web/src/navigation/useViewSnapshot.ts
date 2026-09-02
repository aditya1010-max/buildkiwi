import { useContext, useEffect, useRef } from "react";

import {
  NavigationSnapshotContext,
  type ViewSnapshotRegistration,
} from "./NavigationSnapshotContext";

export function useViewSnapshot(registration: ViewSnapshotRegistration) {
  const context = useContext(NavigationSnapshotContext);

  if (!context) {
    throw new Error(
      "useViewSnapshot must be used inside NavigationSnapshotProvider",
    );
  }

  const registrationRef = useRef(registration);

  useEffect(() => {
    registrationRef.current = registration;
  }, [registration]);

  useEffect(() => {
    return context.register({
      id: registration.id,

      capture: () => {
        return registrationRef.current.capture();
      },

      restore: (snapshot) => {
        registrationRef.current.restore(snapshot);
      },
    });
  }, [context, registration.id]);
}
