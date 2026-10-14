import { create } from "zustand";
import api from "../api/axiosInstance";
import type { IUser, Role } from "../interfaces/user.interface";
import type { DashboardAnalyticsResponse } from "../interfaces/analytics.interface";
import { toast } from "react-toastify";

interface AdminState {
  analytics: DashboardAnalyticsResponse | null;
  analyticsLoading: boolean;
  users: IUser[];
  totalUserPages: number;
  totalUsersCount: number;
  usersLoading: boolean;

  fetchAnalytics: () => Promise<void>;
  fetchUsers: (search?: string, role?: Role | "", page?: number) => Promise<void>;
  updateUserRole: (userId: number, role: Role) => Promise<boolean>;
  updateUserStatus: (userId: number, enabled: boolean) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  analytics: null,
  analyticsLoading: false,
  users: [],
  totalUserPages: 0,
  totalUsersCount: 0,
  usersLoading: false,

  fetchAnalytics: async () => {
    set({ analyticsLoading: true });
    try {
      const response = await api.get("/admin/analytics/overview");
      set({ analytics: response.data, analyticsLoading: false });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Statistikalarni yuklashda xatolik yuz berdi";
      console.error("Analytics fetch error:", msg);
      set({ analyticsLoading: false });
    }
  },

  fetchUsers: async (search = "", role = "", page = 0) => {
    set({ usersLoading: true });
    try {
      const params: Record<string, string | number> = {
        page,
        size: 10,
        sortBy: "id",
        sortDir: "desc",
      };
      if (search.trim()) params.search = search.trim();
      if (role) params.role = role;

      const response = await api.get("/admin/users", { params });
      set({
        users: response.data.content,
        totalUserPages: response.data.totalPages,
        totalUsersCount: response.data.totalElements,
        usersLoading: false,
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Foydalanuvchilarni yuklashda xatolik yuz berdi";
      toast.error(msg);
      set({ usersLoading: false });
    }
  },

  updateUserRole: async (userId: number, role: Role) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      const updated = response.data;
      set((state) => ({
        users: state.users.map((u) => (u.id === userId ? { ...u, role: updated.role } : u)),
      }));
      toast.success(`Foydalanuvchi roli "${role}" ga muvaffaqiyatli o'zgartirildi`);
      // Update analytics overview roles breakdown
      get().fetchAnalytics();
      return true;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Rolni o'zgartirishda xatolik yuz berdi";
      toast.error(msg);
      return false;
    }
  },

  updateUserStatus: async (userId: number, enabled: boolean) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, { enabled });
      const updated = response.data;
      set((state) => ({
        users: state.users.map((u) => (u.id === userId ? { ...u, enabled: updated.enabled } : u)),
      }));
      toast.success(
        enabled ? "Foydalanuvchi faollashtirildi" : "Foydalanuvchi bloklandi"
      );
      return true;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Holatni o'zgartirishda xatolik yuz berdi";
      toast.error(msg);
      return false;
    }
  },
}));
