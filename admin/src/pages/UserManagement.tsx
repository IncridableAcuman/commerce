import { useEffect, useRef, useState } from "react";
import type IUser from "../interface/userInterface";
import { toast } from "react-toastify";
import adminAxiosInstance from "../api/axiosInstance";
import { Edit, MoreVertical, Trash2 } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
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

  return (
    <div>
      <table className="w-full border border-gray-200 rounded-xl">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="text-left p-3">ID</th>
            <th className="text-left p-3">Firstname</th>
            <th className="text-left p-3">Lastname</th>
            <th className="text-left p-3">Username</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Role</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-t border-t-gray-300 hover:bg-gray-50 text-sm"
            >
              <td className="p-3">{user.id}</td>
              <td className="p-3">{user.firstname}</td>
              <td className="p-3">{user.lastname}</td>
              <td className="p-3">{user.username}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3 relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(openMenu === user.id ? null : user.id);
                  }}
                  className="text-gray-600 hover:text-black"
                >
                  <MoreVertical size={16} />
                </button>

                {openMenu === user.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                  >
                    <button
                      onClick={() => openEditModal(user)}
                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-sm"
                    >
                      <Edit size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-red-500 text-sm"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <h2 className="text-lg font-semibold mb-4">Edit User</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Firstname"
                value={editData.firstname}
                onChange={(e) =>
                  setEditData({ ...editData, firstname: e.target.value })
                }
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Lastname"
                value={editData.lastname}
                onChange={(e) =>
                  setEditData({ ...editData, lastname: e.target.value })
                }
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Username"
                value={editData.username}
                onChange={(e) =>
                  setEditData({ ...editData, username: e.target.value })
                }
                className="border px-3 py-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                className="border px-3 py-2 rounded"
              />
              <select
                value={editData.role}
                onChange={(e) =>
                  setEditData({ ...editData, role: e.target.value })
                }
                className="border px-3 py-2 rounded"
              >
                <option value="">Role tanlang</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
