import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";
import { useAuthStore } from "../stores/authStore";
import { useAdminStore } from "../stores/adminStore";

vi.mock("../api/axiosInstance", () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

describe("AdminDashboard page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Oddiy foydalanuvchi (USER) uchun 'Kirish taqiqlangan' xabarini ko'rsatadi", () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 1,
        fullName: "Oddiy User",
        username: "user",
        email: "user@test.com",
        role: "USER",
        avatar: "",
        enabled: true,
        createdAt: "",
        updatedAt: "",
      },
    });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText("Kirish taqiqlangan")).toBeInTheDocument();
  });

  it("ADMIN uchun Boshqaruv paneli va Rollar boshqaruvi tabini ko'rsatadi", () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 2,
        fullName: "Bosh Admin",
        username: "admin",
        email: "admin@test.com",
        role: "ADMIN",
        avatar: "",
        enabled: true,
        createdAt: "",
        updatedAt: "",
      },
    });

    useAdminStore.setState({
      analytics: {
        overview: {
          totalRevenue: 5000,
          totalOrders: 20,
          totalProducts: 50,
          totalUsers: 15,
          todayRevenue: 500,
          todayOrders: 2,
          lowStockCount: 1,
          outOfStockCount: 0,
          pendingOrders: 2,
        },
        ordersByStatus: { PENDING: 2, DELIVERED: 18 },
        usersByRole: { ADMIN: 2, MANAGER: 3, USER: 10 },
        dailySales: [],
        topProducts: [],
        lowStockProducts: [],
        recentOrders: [],
      },
      analyticsLoading: false,
    });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText("Boshqaruv Paneli & Statistika")).toBeInTheDocument();
    expect(screen.getByText("Rollar boshqaruvi (ADMIN)")).toBeInTheDocument();
    expect(screen.getByText("Statistika & Grafiklar")).toBeInTheDocument();
  });

  it("MANAGER uchun Rollar boshqaruvi tabini yashiradi, lekin Mahsulotlar va Buyurtmalarni ko'rsatadi", () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 3,
        fullName: "Menejer",
        username: "manager",
        email: "manager@test.com",
        role: "MANAGER",
        avatar: "",
        enabled: true,
        createdAt: "",
        updatedAt: "",
      },
    });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText("Boshqaruv Paneli & Statistika")).toBeInTheDocument();
    expect(screen.queryByText("Rollar boshqaruvi (ADMIN)")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Mahsulotlar \(/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Buyurtmalar \(/ })).toBeInTheDocument();


  });
});
