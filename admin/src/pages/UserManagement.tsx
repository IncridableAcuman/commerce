import { useCallback, useEffect, useState, useRef } from "react";
import {
  RefreshCw,
  Edit2,
  Trash2,
  X,
  Search,
  ChevronDown,
  User,
  Shield,
  AlertTriangle,
  Check,
  MoreHorizontal,
} from "lucide-react";
import type IUser from "../interface/userInterface";
import { toast } from "react-toastify";
import adminAxiosInstance from "../api/axiosInstance";

// ─── Edit Modal ───────────────────────────────────────────────────────────────
interface EditModalProps {
  user: IUser;
  onClose: () => void;
  onSave: (updated: IUser) => void;
}

const EditModal = ({ user, onClose, onSave }: EditModalProps) => {
  const [form, setForm] = useState<IUser>({ ...user });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await adminAxiosInstance.patch(`/user/${user.id}`, form);
      onSave(data ?? form);
      toast.success("Foydalanuvchi yangilandi");
      onClose();
    } catch {
      toast.error("Yangilashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-violet-500 via-blue-500 to-cyan-400" />

        <div className="px-6 pt-5 pb-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-100 to-blue-100 flex items-center justify-center">
                <User size={18} className="text-violet-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Foydalanuvchini tahrirlash
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  @{user.username}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { label: "Ism", field: "firstname" },
                { label: "Familiya", field: "lastname" },
                { label: "Username", field: "username" },
                { label: "Email", field: "email" },
              ] as { label: string; field: keyof IUser }[]
            ).map(({ label, field }) => (
              <div
                key={field}
                className={field === "email" ? "col-span-2" : ""}
              >
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  {label}
                </label>
                <input
                  value={(form[field] as string) ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [field]: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all placeholder:text-gray-300"
                />
              </div>
            ))}

            {/* Role */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Role
              </label>
              <div className="relative">
                <select
                  value={form.role ?? "user"}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, role: e.target.value }))
                  }
                  className="w-full appearance-none px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-5">
            <button
              onClick={onClose}
              className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-60 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              Saqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
interface DeleteModalProps {
  user: IUser;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal = ({ user, onClose, onConfirm }: DeleteModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in">
        <div className="h-1 w-full bg-linear-to-r from-red-400 to-rose-500" />
        <div className="px-6 py-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            O'chirishni tasdiqlang
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            <span className="font-medium text-gray-700">
              {user.firstname} {user.lastname}
            </span>{" "}
            foydalanuvchisi butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              O'chirish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Row Action Menu ──────────────────────────────────────────────────────────
interface RowMenuProps {
  user: IUser;
  onEdit: () => void;
  onDelete: () => void;
}

const RowMenu = ({ user, onEdit, onDelete }: RowMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`p-1.5 rounded-lg transition-colors ${
          open
            ? "bg-gray-100 text-gray-700"
            : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
        }`}
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex items-center w-full px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 gap-2.5 transition-colors"
          >
            <Edit2 size={13} className="text-blue-500" />
            Tahrirlash
          </button>
          <div className="mx-2 my-1 border-t border-gray-50" />
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex items-center w-full px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 gap-2.5 transition-colors"
          >
            <Trash2 size={13} />
            O'chirish
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Role Badge ───────────────────────────────────────────────────────────────
const roleMeta: Record<string, { bg: string; text: string; icon?: React.ReactNode }> = {
  admin: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    icon: <Shield size={10} />,
  },
  moderator: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: <Shield size={10} />,
  },
  user: { bg: "bg-blue-50", text: "text-blue-600" },
};

const RoleBadge = ({ role }: { role?: string }) => {
  const key = role?.toLowerCase() ?? "user";
  const meta = roleMeta[key] ?? roleMeta.user;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${meta.bg} ${meta.text}`}
    >
      {meta.icon}
      {role ?? "user"}
    </span>
  );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "from-violet-400 to-indigo-500",
  "from-blue-400 to-cyan-500",
  "from-emerald-400 to-teal-500",
  "from-orange-400 to-rose-400",
  "from-pink-400 to-fuchsia-500",
];

const Avatar = ({ user }: { user: IUser }) => {
  const idx = (user.id ?? 0) % AVATAR_COLORS.length;
  const initials = `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase();
  return (
    <div
      className={`w-8 h-8 rounded-lg bg-linear-to-br ${AVATAR_COLORS[idx]} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}
    >
      {initials || <User size={14} />}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const UserManagement = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<IUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminAxiosInstance.get("/user/list");
      setUsers(data);
    } catch {
      toast.error("Foydalanuvchilarni olishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async () => {
    if (!deleteUser?.id) return;
    try {
      const { data } = await adminAxiosInstance.delete(`/user/${deleteUser.id}`);
      toast.success(data ?? "O'chirildi");
      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      setDeleteUser(null);
    } catch {
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  const handleSave = (updated: IUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      !q ||
      u.firstname?.toLowerCase().includes(q) ||
      u.lastname?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Foydalanuvchilar
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Jami{" "}
              <span className="font-medium text-gray-600">{users.length}</span>{" "}
              ta foydalanuvchi
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Qidirish..."
                className="pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all w-44 placeholder:text-gray-300"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Refresh */}
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-50 transition-all"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin" : ""}
              />
              Yangilash
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">
                  Foydalanuvchi
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5 hidden lg:table-cell">
                  Username
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5 hidden md:table-cell">
                  Email
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5 hidden sm:table-cell">
                  Role
                </th>
                <th className="px-5 py-3.5 w-12" />
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading && users.length === 0 ? (
                // Skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 bg-gray-100 rounded" />
                          <div className="h-2.5 w-20 bg-gray-100 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="h-3 w-24 bg-gray-100 rounded" />
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="h-3 w-36 bg-gray-100 rounded" />
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <div className="h-5 w-14 bg-gray-100 rounded-full" />
                    </td>
                    <td className="px-5 py-4" />
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-16 text-center text-sm text-gray-400"
                  >
                    {search
                      ? `"${search}" bo'yicha hech narsa topilmadi`
                      : "Foydalanuvchilar topilmadi"}
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    {/* User cell */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar user={user} />
                        <div>
                          <p className="text-sm font-medium text-gray-900 leading-tight">
                            {user.firstname} {user.lastname}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 lg:hidden">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-sm text-gray-500 hidden lg:table-cell">
                      @{user.username}
                    </td>

                    <td className="px-5 py-3.5 text-sm text-gray-500 hidden md:table-cell">
                      {user.email}
                    </td>

                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <RoleBadge role={user.role} />
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <RowMenu
                        user={user}
                        onEdit={() => setEditUser(user)}
                        onDelete={() => setDeleteUser(user)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {filtered.length === users.length
                  ? `${users.length} ta foydalanuvchi`
                  : `${filtered.length} / ${users.length} natija`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {editUser && (
        <EditModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={handleSave}
        />
      )}
      {deleteUser && (
        <DeleteModal
          user={deleteUser}
          onClose={() => setDeleteUser(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default UserManagement;