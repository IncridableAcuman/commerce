import { create } from "zustand";
import api from "../api/axiosInstance";
import type {
  Order,
  CreateOrderRequest,
  OrderStatus,
  PaymentStatus,
  OrderStatistics,
} from "../interfaces/order.interface";

interface OrderState {
  orders: Order[];
  adminOrders: Order[];
  currentOrder: Order | null;
  statistics: OrderStatistics | null;
  loading: boolean;
  adminLoading: boolean;
  error: string | null;
  totalPages: number;
  totalElements: number;
  adminTotalPages: number;
  adminTotalElements: number;

  // Actions
  createOrder: (request: CreateOrderRequest) => Promise<Order>;
  fetchMyOrders: (page?: number, size?: number) => Promise<void>;
  fetchOrderById: (id: number) => Promise<Order>;
  trackOrderByNumber: (orderNumber: string) => Promise<Order>;
  cancelOrder: (id: number) => Promise<Order>;
  fetchAdminOrders: (
    search?: string,
    status?: OrderStatus | "",
    page?: number,
    size?: number
  ) => Promise<void>;
  fetchAdminStatistics: () => Promise<void>;
  updateAdminOrderStatus: (
    id: number,
    status: OrderStatus,
    paymentStatus?: PaymentStatus
  ) => Promise<Order>;
  clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  adminOrders: [],
  currentOrder: null,
  statistics: null,
  loading: false,
  adminLoading: false,
  error: null,
  totalPages: 0,
  totalElements: 0,
  adminTotalPages: 0,
  adminTotalElements: 0,

  createOrder: async (request: CreateOrderRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<Order>("/orders", request);
      const newOrder = response.data;
      set((state) => ({
        currentOrder: newOrder,
        orders: [newOrder, ...state.orders],
        loading: false,
      }));
      return newOrder;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Buyurtma yaratishda xatolik yuz berdi";
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  fetchMyOrders: async (page = 0, size = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<{
        content: Order[];
        totalPages: number;
        totalElements: number;
      }>("/orders/my", {
        params: { page, size },
      });
      set({
        orders: response.data.content,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        loading: false,
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Buyurtmalarni yuklashda xatolik";
      set({ error: msg, loading: false });
    }
  },

  fetchOrderById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<Order>(`/orders/${id}`);
      set({ currentOrder: response.data, loading: false });
      return response.data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Buyurtma topilmadi";
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  trackOrderByNumber: async (orderNumber: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<Order>(`/orders/track/${orderNumber}`);
      set({ currentOrder: response.data, loading: false });
      return response.data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Buyurtma topilmadi";
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  cancelOrder: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put<Order>(`/orders/${id}/cancel`);
      const updated = response.data;
      set((state) => ({
        currentOrder: updated,
        orders: state.orders.map((o) => (o.id === id ? updated : o)),
        adminOrders: state.adminOrders.map((o) => (o.id === id ? updated : o)),
        loading: false,
      }));
      return updated;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Buyurtmani bekor qilishda xatolik";
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  fetchAdminOrders: async (
    search = "",
    status = "",
    page = 0,
    size = 15
  ) => {
    set({ adminLoading: true, error: null });
    try {
      const params: Record<string, string | number> = { page, size };
      if (search.trim()) params.search = search.trim();
      if (status) params.status = status;

      const response = await api.get<{
        content: Order[];
        totalPages: number;
        totalElements: number;
      }>("/orders/admin", { params });

      set({
        adminOrders: response.data.content,
        adminTotalPages: response.data.totalPages,
        adminTotalElements: response.data.totalElements,
        adminLoading: false,
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Admin buyurtmalarini yuklashda xatolik";
      set({ error: msg, adminLoading: false });
    }
  },

  fetchAdminStatistics: async () => {
    try {
      const response = await api.get<OrderStatistics>(
        "/orders/admin/statistics"
      );
      set({ statistics: response.data });
    } catch (err: unknown) {
      console.error("Statistika olishda xatolik:", err);
    }
  },

  updateAdminOrderStatus: async (
    id: number,
    status: OrderStatus,
    paymentStatus?: PaymentStatus
  ) => {
    set({ adminLoading: true, error: null });
    try {
      const response = await api.put<Order>(`/orders/admin/${id}/status`, {
        status,
        paymentStatus,
      });
      const updated = response.data;
      set((state) => ({
        adminOrders: state.adminOrders.map((o) => (o.id === id ? updated : o)),
        orders: state.orders.map((o) => (o.id === id ? updated : o)),
        currentOrder: state.currentOrder?.id === id ? updated : state.currentOrder,
        adminLoading: false,
      }));
      return updated;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Statusni o'zgartirishda xatolik";
      set({ error: msg, adminLoading: false });
      throw new Error(msg);
    }
  },

  clearCurrentOrder: () => set({ currentOrder: null }),
}));
