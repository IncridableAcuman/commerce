import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="w-64 h-screen hidden md:flex shrink-0 border-r border-gray-100 bg-white">
        <Sidebar />
      </aside>
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;