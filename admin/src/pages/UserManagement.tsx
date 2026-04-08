import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Edit, Trash2 } from "lucide-react";
import type IUser from "../interface/userInterface";
import { toast } from "react-toastify";
import adminAxiosInstance from "../api/axiosInstance";

const UserManagement = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  // Memoized fetch function so it can be used in useEffect and the Refresh button
  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await adminAxiosInstance.get("/user/list");
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Foydalanuvchilarni olishda xatolik yuz berdi");
    }
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const { data } = await adminAxiosInstance.delete(`/user/${id}`);
      toast.success(data);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.log("Foydalanuvhini o'chirishda xatolik yuz berdi", error);
      toast.error("Foydalanuvhini o'chirishda xatolik yuz berdi");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-900">User management</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Jami {users.length} ta foydalanuvchi
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-medium text-gray-400 uppercase px-5 py-3.5">
                Foydalanuvchi
              </th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase px-5 py-3.5 hidden md:table-cell">
                Firstname
              </th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase px-5 py-3.5 hidden sm:table-cell">
                Lastname
              </th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase px-5 py-3.5 hidden lg:table-cell">
                Username
              </th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase px-5 py-3.5 hidden lg:table-cell">
                Email
              </th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase px-5 py-3.5 hidden lg:table-cell">
                Role
              </th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-5 py-4 text-sm font-medium text-gray-900">
                  {user.firstname} {user.lastname}
                </td>
                <td className="px-5 py-4 text-sm text-gray-600 hidden md:table-cell">
                  {user.firstname}
                </td>
                <td className="px-5 py-4 text-sm text-gray-600 hidden sm:table-cell">
                  {user.lastname}
                </td>
                <td className="px-5 py-4 text-sm text-gray-500 hidden lg:table-cell">
                  @{user.username}
                </td>
                <td className="px-5 py-4 text-sm text-gray-500 hidden lg:table-cell">
                  {user.email}
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 capitalize">
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-4 text-right relative">
                  <button
                    onClick={() => user.id && handleDelete(user.id)}
                    className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 "
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Dropdown Menu Example */}
                  {openMenu === user.id && (
                    <div className="absolute right-10 top-12 w-32 bg-white border border-gray-100 rounded-lg shadow-lg z-20 py-1">
                      <button className="flex items-center w-full px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 gap-2">
                        <Edit size={14} /> Edit
                      </button>
                      <button className="flex items-center w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 gap-2">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
      )}
    </div>
  );
};

export default UserManagement;
