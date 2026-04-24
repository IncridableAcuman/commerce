import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { UseAdminContext } from "../context/AdminProvider";

const UserManagement = () => {
  const {
    users,
    setOpenMenu,
    openMenu,
    menuRef,
    isEditOpen,
    setIsEditOpen,
    openEditModal,
    handleDeleteUser,
    editData,
    setEditData,
    handleEditSubmit
  } = UseAdminContext();

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
