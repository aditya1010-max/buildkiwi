import type { ViewSnapshot } from "./snapshot-types";

const STORAGE_PREFIX = "buildkiwi:navigation-snapshot:";

function getStorageKey(locationKey: string) {
  return `${STORAGE_PREFIX}${locationKey}`;
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveSnapshot(locationKey: string, snapshot: ViewSnapshot) {
  if (!isBrowser()) {
    return;
  }

  try {
    sessionStorage.setItem(
      getStorageKey(locationKey),
      JSON.stringify(snapshot),
    );
  } catch (error) {
    console.warn("[NavigationSnapshot] Failed to save snapshot:", error);
  }
}

export function getSnapshot(locationKey: string): ViewSnapshot | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(getStorageKey(locationKey));

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as ViewSnapshot;
  } catch (error) {
    console.warn("[NavigationSnapshot] Failed to read snapshot:", error);

    return null;
  }
}

export function removeSnapshot(locationKey: string) {
  if (!isBrowser()) {
    return;
  }

  try {
    sessionStorage.removeItem(getStorageKey(locationKey));
  } catch (error) {
    console.warn("[NavigationSnapshot] Failed to remove snapshot:", error);
  }
}

export function clearSnapshots() {
  if (!isBrowser()) {
    return;
  }

  try {
    const keysToRemove: string[] = [];

    for (let index = 0; index < sessionStorage.length; index++) {
      const key = sessionStorage.key(index);

      if (key?.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    for (const key of keysToRemove) {
      sessionStorage.removeItem(key);
    }
  } catch (error) {
    console.warn("[NavigationSnapshot] Failed to clear snapshots:", error);
  }
}
