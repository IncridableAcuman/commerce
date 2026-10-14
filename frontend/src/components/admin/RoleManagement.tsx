import { useState, useEffect } from "react";
import { useAdminStore } from "../../stores/adminStore";
import { useAuthStore } from "../../stores/authStore";
import type { IUser, Role } from "../../interfaces/user.interface";
import {
  Search,
  Filter,
  Shield,
  ShieldAlert,
  UserCheck,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const RoleManagement = () => {
  const { user: currentUser } = useAuthStore();
  const {
    users,
    totalUserPages,
    totalUsersCount,
    usersLoading,
    fetchUsers,
    updateUserRole,
    updateUserStatus,
  } = useAdminStore();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [currentPage, setCurrentPage] = useState(0);

  // Rol o'zgartirish modali holati
  const [targetUser, setTargetUser] = useState<IUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>("USER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers(search, roleFilter, currentPage);
  }, [search, roleFilter, currentPage, fetchUsers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchUsers(search, roleFilter, 0);
  };

  const openRoleModal = (u: IUser) => {
    setTargetUser(u);
    setSelectedRole(u.role);
  };

  const handleRoleSave = async () => {
    if (!targetUser) return;
    setIsSubmitting(true);
    const success = await updateUserRole(targetUser.id, selectedRole);
    if (success) {
      setTargetUser(null);
    }
    setIsSubmitting(false);
  };

  const handleToggleStatus = async (u: IUser) => {
    if (u.id === currentUser?.id) {
      return;
    }
    await updateUserStatus(u.id, !u.enabled);
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            ADMIN
          </span>
        );
      case "MANAGER":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5" />
            MANAGER
          </span>
        );
      case "USER":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
            <UserCheck className="w-3.5 h-3.5" />
            USER
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Ma'lumot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            Foydalanuvchilar va Rollarni boshqarish
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Foydalanuvchilarga ADMIN, MANAGER yoki USER rollarini belgilash va akkaunt faolligini nazorat qilish
          </p>
        </div>

        <button
          onClick={() => fetchUsers(search, roleFilter, currentPage)}
          disabled={usersLoading}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${usersLoading ? "animate-spin" : ""}`} />
          <span>Yangilash</span>
        </button>
      </div>

      {/* 2. Qidiruv va Filtr */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism, username yoki email..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as Role | "");
                setCurrentPage(0);
              }}
              className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
            >
              <option value="" className="bg-slate-900 text-slate-200">
                Barcha rollar ({totalUsersCount})
              </option>
              <option value="ADMIN" className="bg-slate-900 text-slate-200">
                ADMIN
              </option>
              <option value="MANAGER" className="bg-slate-900 text-slate-200">
                MANAGER
              </option>
              <option value="USER" className="bg-slate-900 text-slate-200">
                USER
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Foydalanuvchilar Jadvali */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {usersLoading && users.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">Foydalanuvchilar yuklanmoqda...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center space-y-3 text-slate-400">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-medium text-white">Hech qanday foydalanuvchi topilmadi</p>
            <p className="text-xs text-slate-500">Qidiruv yoki rol filtrini o'zgartirib ko'ring</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Foydalanuvchi</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Joriy Rol</th>
                  <th className="py-4 px-6">Holat</th>
                  <th className="py-4 px-6">Ro'yxatdan o'tgan</th>
                  <th className="py-4 px-6 text-right">Rolni boshqarish</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {users.map((u) => {
                  const isCurrent = u.id === currentUser?.id;
                  const formattedDate = u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString("uz-UZ", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—";

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Avatar va Ism */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt={u.fullName || u.username}
                              className="w-9 h-9 rounded-xl object-cover bg-slate-950"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center border border-indigo-500/20">
                              {u.fullName ? u.fullName[0].toUpperCase() : u.username[0].toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{u.fullName || u.username}</span>
                              {isCurrent && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-medium">
                                  Siz
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">@{u.username}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 whitespace-nowrap text-slate-300 font-mono text-xs">
                        {u.email}
                      </td>

                      {/* Rol */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {getRoleBadge(u.role)}
                      </td>

                      {/* Holat (Toggle) */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={isCurrent}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                            u.enabled
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                          } ${isCurrent ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                          title={isCurrent ? "O'z hisobingizni bloklay olmaysiz" : "Holatni o'zgartirish"}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.enabled ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                            }`}
                          />
                          <span>{u.enabled ? "Faol" : "Bloklangan"}</span>
                        </button>
                      </td>

                      {/* Sana */}
                      <td className="py-4 px-6 whitespace-nowrap text-slate-400 text-xs">
                        {formattedDate}
                      </td>

                      {/* Rolni o'zgartirish tugmasi */}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <button
                          onClick={() => openRoleModal(u)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Rolni o'zgartirish
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalUserPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Sahifa {currentPage + 1} / {totalUserPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                disabled={currentPage === 0}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalUserPages - 1))}
                disabled={currentPage >= totalUserPages - 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Rolni o'zgartirish modali */}
      <AnimatePresence>
        {targetUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTargetUser(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Rolni belgilash</h3>
                    <p className="text-xs text-slate-400">{targetUser.fullName || targetUser.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => setTargetUser(null)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {targetUser.id === currentUser?.id && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Diqqat: Siz o'zingizning akkauntingizni tahrirlayapsiz. Administrator o'z rolini pasaytira olmaydi.
                  </span>
                </div>
              )}

              {/* Rol variantlari */}
              <div className="space-y-3">
                {[
                  {
                    role: "ADMIN" as Role,
                    title: "ADMIN — Tizim administratori",
                    desc: "Barcha huquqlar: rollarni belgilash, mahsulot va buyurtmalarni to'liq boshqarish",
                    icon: ShieldAlert,
                    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
                  },
                  {
                    role: "MANAGER" as Role,
                    title: "MANAGER — Menejer",
                    desc: "Mahsulotlar qo'shish/o'chirish/yangilash va buyurtmalar statuslarini boshqarish",
                    icon: Briefcase,
                    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
                  },
                  {
                    role: "USER" as Role,
                    title: "USER — Oddiy mijoz",
                    desc: "Mahsulotlarni ko'rish, savatga qo'shish va buyurtma berish imkoniyati",
                    icon: UserCheck,
                    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                  },
                ].map((item) => {
                  const isSelected = selectedRole === item.role;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.role}
                      onClick={() => setSelectedRole(item.role)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? "bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/20"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{item.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-indigo-600 border-indigo-500 text-white"
                            : "border-slate-700"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Amallar */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTargetUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  disabled={isSubmitting || (targetUser.id === currentUser?.id && selectedRole !== "ADMIN")}
                  onClick={handleRoleSave}
                  className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {isSubmitting ? "Saqlanmoqda..." : "Rolni tasdiqlash"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
