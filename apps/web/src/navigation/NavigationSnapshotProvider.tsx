import { useCallback, useEffect, useRef, type PropsWithChildren } from "react";
import {
  useLocation,
  useNavigationType,
  type Location,
} from "react-router-dom";

import {
  NavigationSnapshotContext,
  type ViewSnapshotData,
  type ViewSnapshotRegistration,
} from "./NavigationSnapshotContext";

import { getSnapshot, saveSnapshot } from "./snapshot-store";

import type { SnapshotLocation, ViewSnapshot } from "./snapshot-types";

type LocationState = {
  background?: Location;
};

function getSnapshotLocation(location: Location): SnapshotLocation {
  return {
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  };
}

export default function NavigationSnapshotProvider({
  children,
}: PropsWithChildren) {
  const location = useLocation();
  const navigationType = useNavigationType();

  const state = location.state as LocationState | null;

  const isModalRoute = Boolean(state?.background);

  const viewLocation = state?.background ?? location;

  const registrationsRef = useRef<Map<string, ViewSnapshotRegistration>>(
    new Map(),
  );

  const previousLocationRef = useRef(viewLocation);

  const scrollPositionRef = useRef(window.scrollY);

  /*
   * --------------------------------------------------
   * Scroll tracking
   * --------------------------------------------------
   */

  useEffect(() => {
    const handleScroll = () => {
      scrollPositionRef.current = window.scrollY;
    };

    scrollPositionRef.current = window.scrollY;

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*
   * --------------------------------------------------
   * Browser restoration
   * --------------------------------------------------
   */

  useEffect(() => {
    const previous = window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  /*
   * --------------------------------------------------
   * Registration
   * --------------------------------------------------
   */

  const register = useCallback((registration: ViewSnapshotRegistration) => {
    registrationsRef.current.set(registration.id, registration);

    return () => {
      registrationsRef.current.delete(registration.id);
    };
  }, []);

  /*
   * --------------------------------------------------
   * Capture
   * --------------------------------------------------
   */

  const capture = useCallback(() => {
    const registrations = Array.from(registrationsRef.current.values());

    if (registrations.length === 0) {
      return null;
    }

    const result: ViewSnapshotData = {};

    for (const registration of registrations) {
      try {
        const captured = registration.capture();

        if (captured.state) {
          result.state = {
            ...(result.state ?? {}),
            ...captured.state,
          };
        }
      } catch (error) {
        console.warn(
          `[NavigationSnapshot] Failed to capture "${registration.id}"`,
          error,
        );
      }
    }

    return result;
  }, []);

  /*
   * --------------------------------------------------
   * Restore
   * --------------------------------------------------
   */

  const restore = useCallback((snapshot: ViewSnapshot) => {
    const registrations = Array.from(registrationsRef.current.values());

    for (const registration of registrations) {
      try {
        registration.restore(snapshot);
      } catch (error) {
        console.warn(
          `[NavigationSnapshot] Failed to restore "${registration.id}"`,
          error,
        );
      }
    }
  }, []);

  /*
   * --------------------------------------------------
   * Save previous view
   * --------------------------------------------------
   */

  useEffect(() => {
    const previousLocation = previousLocationRef.current;

    return () => {
      /*
       * Opening a modal does not mean the
       * background view was left.
       */
      if (isModalRoute) {
        return;
      }

      const captured = capture();

      const snapshot: ViewSnapshot = {
        version: 1,

        location: getSnapshotLocation(previousLocation),

        scroll: {
          x: window.scrollX,
          y: scrollPositionRef.current,
        },

        ...(captured ?? {}),
      };

      saveSnapshot(previousLocation.key, snapshot);

      console.log("[NavigationSnapshot] Saved:", {
        key: previousLocation.key,
        snapshot,
      });
    };
  }, [
    viewLocation.pathname,
    viewLocation.search,
    viewLocation.hash,
    isModalRoute,
    capture,
  ]);

  /*
   * --------------------------------------------------
   * Restore navigation
   * --------------------------------------------------
   */

  useEffect(() => {
    /*
     * Modal opening:
     *
     * /discover → /create
     *
     * Preserve the background page exactly as it is.
     */
    if (isModalRoute) {
      previousLocationRef.current = viewLocation;

      return;
    }

    /*
     * PUSH / REPLACE
     *
     * New navigation starts at the top.
     */
    if (navigationType !== "POP") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      scrollPositionRef.current = 0;

      previousLocationRef.current = viewLocation;

      return;
    }

    /*
     * POP
     *
     * Back / Forward.
     */
    const snapshot = getSnapshot(viewLocation.key);

    console.log("[NavigationSnapshot] POP:", {
      key: viewLocation.key,
      pathname: viewLocation.pathname,
      snapshot,
    });

    /*
     * No snapshot → default to top.
     */
    if (!snapshot) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      scrollPositionRef.current = 0;

      previousLocationRef.current = viewLocation;

      return;
    }

    /*
     * First allow participating components
     * to restore their own state.
     */
    restore(snapshot);

    /*
     * Then restore the physical scroll
     * after React commits.
     */
    const frame = requestAnimationFrame(() => {
      window.scrollTo({
        top: snapshot.scroll.y,
        left: snapshot.scroll.x,
        behavior: "auto",
      });

      scrollPositionRef.current = snapshot.scroll.y;
    });

    previousLocationRef.current = viewLocation;

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [viewLocation, navigationType, isModalRoute, restore]);

  const contextValue = {
    register,
    capture,
    restore,
  };

  return (
    <NavigationSnapshotContext.Provider value={contextValue}>
      {children}
    </NavigationSnapshotContext.Provider>
  );
}
