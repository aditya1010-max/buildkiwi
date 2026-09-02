import "./Layout.css";

import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import { BookmarkProvider } from "../../context/BookmarkProvider";
import { LikeProvider } from "../../context/LikeProvider";
import MobileNav from "./MobileNavbar";

export default function Layout() {
  return (
    <div className="app-layout">
      <MobileNav />

      <div className="layout">
        <Sidebar />

        <main className="layout_content">
          <BookmarkProvider>
            <LikeProvider>
              <Outlet />
            </LikeProvider>
          </BookmarkProvider>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
