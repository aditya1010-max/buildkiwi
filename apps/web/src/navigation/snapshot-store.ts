export type NavigationSnapshot = {
  locationKey: string;
  pathname: string;
  search: string;
  hash: string;
  scrollX: number;
  scrollY: number;
};

const snapshots = new Map<string, NavigationSnapshot>();

export function saveSnapshot(
  locationKey: string,
  snapshot: NavigationSnapshot,
) {
  snapshots.set(locationKey, snapshot);
}

export function getSnapshot(locationKey: string): NavigationSnapshot | null {
  return snapshots.get(locationKey) ?? null;
}

export function removeSnapshot(locationKey: string) {
  snapshots.delete(locationKey);
}

export function clearSnapshots() {
  snapshots.clear();
}
