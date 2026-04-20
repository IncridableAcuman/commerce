import { LogOut, Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import adminAxiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import type IUser from "../interface/userInterface";

const Navbar = () => {
  const navigate = useNavigate();
  const [user,setUser] = useState<IUser>();

  useEffect(()=>{

    const fetchUser = async () => {
      try {
        const {data} = await adminAxiosInstance.get("/user/me");
        setUser(data)
      } catch (error) {
        console.log(error);
        toast.error("Foydalanuvchini olishda xatolik yuz berdi");
      }
    }
    fetchUser();
  },[]);

  const handleLogout = async () => {
    try {
      const {data} = await adminAxiosInstance.post("/auth/logout");
      toast.success(data);
      localStorage.removeItem("accessToken");
      navigate("/login")
    } catch (error) {
      console.log(error);
      toast.error("Logging out failed")
    }
  };

  

  return (
    <header className="w-full h-14 bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 w-64">
        <Search size={14} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-300 w-full"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-400" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-100 mx-1" />

        {/* Avatar */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-linear-to-br from-teal-400 to-blue-400 flex items-center justify-center text-white text-xs font-medium">
            {user?.username.slice(0,1)}
          </div>
          <span className="text-sm text-gray-600 hidden sm:block">{user?.username}</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
        >
          <LogOut size={14} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;