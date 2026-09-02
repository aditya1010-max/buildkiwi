export type SnapshotLocation = {
  pathname: string;
  search: string;
  hash: string;
};

export type ScrollSnapshot = {
  x: number;
  y: number;
};

export type ViewSnapshot = {
  version: 1;

  location: SnapshotLocation;

  scroll: ScrollSnapshot;

  state?: Record<string, unknown>;
};
