import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type AdminContextIinterface from "../interface/adminContext.interface";
import type IUser from "../interface/userInterface";
import adminAxiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { LoginForm } from "../../../client/src/schema/authForm";

const AdminContext = createContext<AdminContextIinterface | null>(null);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const navigate = useNavigate();
  const [editData, setEditData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const getUserList = async () => {
      try {
        const { data } = await adminAxiosInstance.get("/user/list");
        setUsers(data);
      } catch (error) {
        console.log("Foydalanuvchilarni olishda xatolik yuz berdi", error);
        toast.error("Foydalanuvchilarni olishda xatolik yuz berdi");
      }
    };
    getUserList();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleDeleteUser = async (id: number) => {
    try {
      const { data } = await adminAxiosInstance.delete(`/user/${id}`);
      toast.success(data);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.log(error);
      toast.error("Foydalanuvchini o'chirishda xatolik yuz berdi");
    }
  };

  const openEditModal = (user: IUser) => {
    setSelectedUser(user);
    setEditData({
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setIsEditOpen(true);
    setOpenMenu(null);
  };

  const handleEditSubmit = async () => {
    if (!selectedUser) return;
    try {
      const { data } = await adminAxiosInstance.patch(
        `/user/${selectedUser.id}`,
        editData,
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? data : u)),
      );
      toast.success("Foydalanuvchi yangilandi");
      setIsEditOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.log(error);
      toast.error("Foydalanuvchini yangilashda xatolik yuz berdi");
    }
  };

  const onSubmit = async (values: LoginForm) => {
    setLoading(true);
    try {
      const { data } = await adminAxiosInstance.post("/auth/login", values);
      localStorage.setItem("accessToken", data.accessToken);
      toast.success("Successfully logged in");
      navigate("/");
    } catch (error) {
      console.log(error);
      localStorage.removeItem("accessToken");
      toast.error("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminContext.Provider
        value={{
          openMenu,
          setOpenMenu,
          menuRef,
          users,
          setUsers,
          isEditOpen,
          setIsEditOpen,
          selectedUser,
          setSelectedUser,
          editData,
          setEditData,
          showPassword,
          setShowPassword,
          loading,
          setLoading,
          handleDeleteUser,
          openEditModal,
          handleEditSubmit,
          onSubmit
        }}
      >
        {children}
      </AdminContext.Provider>
    </>
  );
};

export const UseAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context)
    throw new Error("This context must be used with Admin provider");
  return context;
};
