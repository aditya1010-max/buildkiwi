import "./Layout.css";

import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />

      <main className="layout__content">
        <Outlet />
      </main>

      <RightSidebar />
    </div>
  );
}
