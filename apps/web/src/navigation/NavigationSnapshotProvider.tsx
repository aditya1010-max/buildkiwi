import { useEffect, useRef, type PropsWithChildren } from "react";
import {
  useLocation,
  useNavigationType,
  type NavigationType,
} from "react-router-dom";

import { getSnapshot, saveSnapshot } from "./snapshot-store";

function isNewNavigation(navigationType: NavigationType) {
  return navigationType === "PUSH" || navigationType === "REPLACE";
}

function getScrollContainer(pathname: string) {
  if (pathname === "/") {
    return document.querySelector<HTMLElement>(".feed-content");
  }

  return null;
}

function scrollToPosition(
  container: HTMLElement | null,
  scrollX: number,
  scrollY: number,
) {
  if (container) {
    container.scrollTo({
      left: scrollX,
      top: scrollY,
      behavior: "auto",
    });

    return;
  }

  window.scrollTo({
    left: scrollX,
    top: scrollY,
    behavior: "auto",
  });
}

function canReachScrollPosition(
  container: HTMLElement | null,
  scrollY: number,
) {
  if (!container) {
    return true;
  }

  return container.scrollHeight - container.clientHeight >= scrollY;
}

export default function NavigationSnapshotProvider({
  children,
}: PropsWithChildren) {
  const location = useLocation();
  const navigationType = useNavigationType();

  const previousLocationRef = useRef(location);

  const scrollPositionRef = useRef({
    scrollX: 0,
    scrollY: 0,
  });

  useEffect(() => {
    const container = getScrollContainer(location.pathname);

    if (container) {
      const handleScroll = () => {
        scrollPositionRef.current = {
          scrollX: container.scrollLeft,
          scrollY: container.scrollTop,
        };
      };

      handleScroll();

      container.addEventListener("scroll", handleScroll, {
        passive: true,
      });

      return () => {
        saveSnapshot(location.key, {
          locationKey: location.key,
          pathname: location.pathname,
          search: location.search,
          hash: location.hash,
          scrollX: scrollPositionRef.current.scrollX,
          scrollY: scrollPositionRef.current.scrollY,
        });

        container.removeEventListener("scroll", handleScroll);
      };
    }

    const handleScroll = () => {
      scrollPositionRef.current = {
        scrollX: window.scrollX,
        scrollY: window.scrollY,
      };
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      saveSnapshot(location.key, {
        locationKey: location.key,
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
        scrollX: scrollPositionRef.current.scrollX,
        scrollY: scrollPositionRef.current.scrollY,
      });

      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname, location.search, location.hash, location.key]);
  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    if (isNewNavigation(navigationType)) {
      const frame = requestAnimationFrame(() => {
        scrollToPosition(getScrollContainer(location.pathname), 0, 0);
      });

      previousLocationRef.current = location;

      return () => {
        cancelAnimationFrame(frame);
      };
    }

    const snapshot = getSnapshot(location.key);

    if (!snapshot) {
      const frame = requestAnimationFrame(() => {
        scrollToPosition(getScrollContainer(location.pathname), 0, 0);
      });

      previousLocationRef.current = location;

      return () => {
        cancelAnimationFrame(frame);
      };
    }

    const container = getScrollContainer(location.pathname);

    if (canReachScrollPosition(container, snapshot.scrollY)) {
      const frame = requestAnimationFrame(() => {
        scrollToPosition(
          getScrollContainer(location.pathname),
          snapshot.scrollX,
          snapshot.scrollY,
        );
      });

      previousLocationRef.current = location;

      return () => {
        cancelAnimationFrame(frame);
      };
    }

    if (!container) {
      previousLocationRef.current = location;
      return;
    }

    let restored = false;

    const restore = () => {
      if (restored) {
        return;
      }

      if (!canReachScrollPosition(container, snapshot.scrollY)) {
        return;
      }

      restored = true;

      scrollToPosition(container, snapshot.scrollX, snapshot.scrollY);

      observer.disconnect();
    };

    const observer = new ResizeObserver(restore);

    observer.observe(container);

    requestAnimationFrame(restore);

    previousLocationRef.current = location;

    return () => {
      restored = true;
      observer.disconnect();
    };
  }, [location, navigationType]);

  return children;
}
