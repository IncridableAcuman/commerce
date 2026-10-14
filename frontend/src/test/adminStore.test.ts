import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAdminStore } from "../stores/adminStore";
import api from "../api/axiosInstance";

vi.mock("../api/axiosInstance", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe("adminStore unit tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAdminStore.setState({
      analytics: null,
      analyticsLoading: false,
      users: [],
      totalUserPages: 0,
      totalUsersCount: 0,
      usersLoading: false,
    });
  });

  it("fetchAnalytics ma'lumotlarni muvaffaqiyatli yuklaydi", async () => {
    const mockData = {
      overview: {
        totalRevenue: 2500,
        totalOrders: 15,
        totalProducts: 40,
        totalUsers: 12,
        todayRevenue: 300,
        todayOrders: 3,
        lowStockCount: 2,
        outOfStockCount: 0,
        pendingOrders: 1,
      },
      ordersByStatus: { PENDING: 1, DELIVERED: 14 },
      usersByRole: { ADMIN: 1, MANAGER: 2, USER: 9 },
      dailySales: [],
      topProducts: [],
      lowStockProducts: [],
      recentOrders: [],
    };

    (api.get as any).mockResolvedValueOnce({ data: mockData });

    await useAdminStore.getState().fetchAnalytics();

    const state = useAdminStore.getState();
    expect(state.analytics).toEqual(mockData);
    expect(state.analyticsLoading).toBe(false);
  });

  it("fetchUsers foydalanuvchilar ro'yxatini yuklaydi", async () => {
    const mockUsers = [
      { id: 1, fullName: "Ali", role: "ADMIN", email: "ali@test.com" },
      { id: 2, fullName: "Vali", role: "USER", email: "vali@test.com" },
    ];

    (api.get as any).mockResolvedValueOnce({
      data: {
        content: mockUsers,
        totalPages: 1,
        totalElements: 2,
      },
    });

    await useAdminStore.getState().fetchUsers();

    const state = useAdminStore.getState();
    expect(state.users).toHaveLength(2);
    expect(state.totalUsersCount).toBe(2);
    expect(state.usersLoading).toBe(false);
  });

  it("updateUserRole rolni o'zgartiradi va store'ni yangilaydi", async () => {
    useAdminStore.setState({
      users: [
        { id: 1, fullName: "Vali", role: "USER", email: "vali@test.com" } as any,
      ],
    });

    (api.put as any).mockResolvedValueOnce({
      data: { id: 1, role: "MANAGER" },
    });
    (api.get as any).mockResolvedValueOnce({ data: { overview: {} } });

    const result = await useAdminStore.getState().updateUserRole(1, "MANAGER");
    expect(result).toBe(true);

    const updatedUser = useAdminStore.getState().users.find((u) => u.id === 1);
    expect(updatedUser?.role).toBe("MANAGER");
  });
});
