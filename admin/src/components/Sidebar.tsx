import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Users,
  BarChart2,
  FileText,
  ChevronDown,
} from "lucide-react";

interface NavItem {
  label: string;
  path?: string;
  icon: React.ReactNode;
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/", icon: <LayoutDashboard size={16} /> },
  { label: "Analytics", path: "/analytics", icon: <BarChart2 size={16} /> },
  { label: "Users", path: "/users", icon: <Users size={16} /> },
  {
    label: "Reports",
    icon: <FileText size={16} />,
    children: [
      { label: "Monthly", path: "/reports/monthly" },
      { label: "Annual", path: "/reports/annual" },
    ],
  },
  { label: "Settings", path: "/settings", icon: <Settings size={16} /> },
];

const Sidebar = () => {
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Top accent */}
      <div className="h-0.75 w-full bg-linear-to-r from-teal-400 via-blue-400 to-purple-400" />

      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-gray-100 shrink-0">
        <span className="text-base font-medium text-gray-900 tracking-tight">MyApp</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          if (item.children) {
            const isGroupOpen = openGroup === item.label;
            const isChildActive = item.children.some((c) => isActive(c.path));

            return (
              <div key={item.label}>
                <button
                  onClick={() => setOpenGroup(isGroupOpen ? null : item.label)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                    isChildActive
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${isGroupOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isGroupOpen && (
                  <div className="ml-8 mt-0.5 space-y-0.5 border-l border-gray-100 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`block px-2 py-1.5 rounded-lg text-sm transition-all duration-150 ${
                          isActive(child.path)
                            ? "text-gray-900 font-medium"
                            : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path!}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                isActive(item.path!)
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user card */}
      <div className="p-3 border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
          <div className="w-7 h-7 rounded-full bg-linear-to-br from-teal-400 to-blue-400 flex items-center justify-center text-white text-xs font-medium shrink-0">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">Username</p>
            <p className="text-xs text-gray-400 truncate">user@email.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;