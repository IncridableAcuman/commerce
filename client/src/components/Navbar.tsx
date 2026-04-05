import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, X, User } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios.instance";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Settings", path: "/settings" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  const isActive = (path: string) => location.pathname === path;

  const handleSubmit = async ()=> {
    try {
      const {data} = await axiosInstance.post("/auth/logout");
      localStorage.removeItem("accessToken");
      toast.success(data);
      navigate("/auth")
    } catch (error) {
      console.log(error);
      toast.error("Logging out failed");
    }
  }


  return (
    <nav className="w-full border-b border-gray-100 bg-white sticky top-0 z-50 shadow">
      {/* Top accent */}
      <div className="h-0.75 w-full bg-linear-to-r from-teal-400 via-blue-400 to-purple-400" />

      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-base font-medium text-gray-900 tracking-tight">
          MyApp
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-150 ${
                isActive(link.path)
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-100 bg-gray-50">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={12} className="text-gray-500" />
            </div>
            <span className="text-sm text-gray-600">Username</span>
          </div>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-gray-500 hover:text-gray-800 transition-colors"
          onClick={() => setMenuOpen((p) => !p)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-4 py-3 space-y-1 bg-white">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                isActive(link.path)
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                <User size={13} className="text-gray-400" />
              </div>
              <span className="text-sm text-gray-500">Username</span>
            </div>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-50 transition-all"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;