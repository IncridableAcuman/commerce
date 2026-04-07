import { useState } from "react";
import {
  Search,
  UserRound,
  Shield,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  role: "admin" | "user";
  isVerified: boolean;
  createdAt: string;
}

type FilterRole = "all" | "admin" | "user";

const ITEMS_PER_PAGE = 8;

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<FilterRole>("all");
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);





  // Filter + search
  const filtered = users.filter((u) => {
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchSearch =
      u.firstname.toLowerCase().includes(search.toLowerCase()) ||
      u.lastname.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getInitials = (u: User) =>
    `${u.firstname[0] ?? ""}${u.lastname[0] ?? ""}`.toUpperCase();

  const avatarColors = [
    "from-teal-400 to-blue-400",
    "from-purple-400 to-pink-400",
    "from-amber-400 to-orange-400",
    "from-green-400 to-teal-400",
    "from-blue-400 to-indigo-400",
  ];

  const getAvatarColor = (id: string) =>
    avatarColors[id.charCodeAt(0) % avatarColors.length];

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
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-2 flex-1">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Ism, email yoki username..."
            className="bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-300 w-full"
          />
        </div>

        {/* Role filter */}
        <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-lg p-1 shrink-0">
          {(["all", "admin", "user"] as FilterRole[]).map((role) => (
            <button
              key={role}
              onClick={() => { setFilterRole(role); setPage(1); }}
              className={`px-3 py-1.5 rounded-md text-sm transition-all duration-150 capitalize ${
                filterRole === role
                  ? "bg-gray-900 text-white font-medium"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3.5">
                  Foydalanuvchi
                </th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3.5 hidden md:table-cell">
                  Username
                </th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3.5 hidden sm:table-cell">
                  Rol
                </th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3.5 hidden lg:table-cell">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3.5 hidden lg:table-cell">
                  Sana
                </th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/60 transition-colors group">
                  {/* Name + email */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-linear-to-br ${getAvatarColor(user.id)} flex items-center justify-center text-white text-xs font-medium shrink-0`}>
                        {getInitials(user)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.firstname} {user.lastname}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Username */}
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-sm text-gray-500">@{user.username}</span>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-50 text-purple-500"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {user.role === "admin" && <Shield size={10} />}
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>
                  </td>

                  {/* Verified */}
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                      user.isVerified
                        ? "bg-green-50 text-green-500"
                        : "bg-amber-50 text-amber-500"
                    }`}>
                      {user.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-xs text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString("uz-UZ")}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="relative flex justify-end">
                      <button
                        onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal size={15} />
                      </button>

                      {openMenu === user.id && (
                        <div className="absolute right-0 top-8 z-20 w-44 bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-100/80 py-1 overflow-hidden">
                          {/* Role toggle */}
                          <button
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <UserRound size={13} className="text-gray-400" />
                            {user.role === "admin" ? "Make user" : "Make admin"}
                          </button>

                          <div className="h-px bg-gray-100 mx-2 my-1" />

                          {/* Delete */}
                          <button
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            Delete user
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} / {filtered.length} ta
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white border border-transparent hover:border-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all ${
                  page === p
                    ? "bg-gray-900 text-white font-medium"
                    : "text-gray-400 hover:text-gray-700 hover:bg-white border border-transparent hover:border-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white border border-transparent hover:border-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Backdrop for closing menu */}
      {openMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
      )}
    </div>
  );
};

export default UserManagement;