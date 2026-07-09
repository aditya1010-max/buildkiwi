import "./DiscoverLayout.css";

import type { ReactNode } from "react";

interface DiscoverLayoutProps {
  children: ReactNode;
}

export default function DiscoverLayout({ children }: DiscoverLayoutProps) {
  return <section className="discover-layout">{children}</section>;
}
