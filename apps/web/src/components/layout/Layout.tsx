import "./Layout.css";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";

type LayoutProps = {  //basically anything React knows how to render. for components like Layout, Modal, and Card, React.ReactNode is almost always the correct type for children.
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <Sidebar />

      <main className="layout__content">{children}</main>

      <RightSidebar />
    </div>
  );
}
