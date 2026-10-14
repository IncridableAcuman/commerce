import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AdminOrders } from "../pages/AdminOrders";
import { useAuthStore } from "../stores/authStore";
import { useOrderStore } from "../stores/orderStore";
import api from "../api/axiosInstance";

vi.mock("../api/axiosInstance");

describe("AdminOrders page integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    useOrderStore.setState({
      adminOrders: [],
      statistics: null,
      adminLoading: false,
      adminTotalPages: 1,
    });
  });

  it("Oddiy foydalanuvchi yoki mehmon uchun kirishni taqiqlaydi", () => {
    useAuthStore.setState({
      user: {
        id: 2,
        username: "oddiy_user",
        email: "user@test.com",
        fullName: "Oddiy User",
        role: "USER",
        avatar: "",
        enabled: true,
      },
      isAuthenticated: true,
      token: "mock-token",
    });

    render(
      <BrowserRouter>
        <AdminOrders />
      </BrowserRouter>
    );

    expect(screen.getByText("Kirish taqiqlangan")).toBeInTheDocument();
    expect(
      screen.getByText("Ushbu sahifani faqat administratorlar (ADMIN) ko'rishi mumkin.")
    ).toBeInTheDocument();
  });

  it("ADMIN roli bo'lganda boshqaruv paneli, statistika va jadvalni ko'rsatadi", () => {
    useAuthStore.setState({
      user: {
        id: 1,
        username: "admin",
        email: "admin@test.com",
        fullName: "Administrator",
        role: "ADMIN",
        avatar: "",
        enabled: true,
      },
      isAuthenticated: true,
      token: "mock-admin-token",
    });

    useOrderStore.setState({
      statistics: {
        totalOrders: 15,
        totalRevenue: 4500.0,
        pendingOrders: 3,
        confirmedOrders: 2,
        processingOrders: 1,
        shippedOrders: 2,
        deliveredOrders: 6,
        cancelledOrders: 1,
      },
      adminOrders: [
        {
          id: 10,
          orderNumber: "ORD-ADM-001",
          customerName: "Dilshod",
          customerEmail: "dilshod@test.com",
          customerPhone: "+998901234567",
          shippingAddress: "Buxoro",
          totalAmount: 250.0,
          status: "PENDING",
          paymentMethod: "CASH_ON_DELIVERY",
          paymentStatus: "PENDING",
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      adminLoading: false,
      adminTotalPages: 1,
    });

    render(
      <BrowserRouter>
        <AdminOrders />
      </BrowserRouter>
    );

    expect(screen.getByText("Buyurtmalar boshqaruvi")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("$4500.00")).toBeInTheDocument();
    expect(screen.getByText("#ORD-ADM-001")).toBeInTheDocument();
    expect(screen.getByText("Dilshod")).toBeInTheDocument();
  });
});
