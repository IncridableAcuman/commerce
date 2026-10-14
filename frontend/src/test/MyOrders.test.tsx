import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { MyOrders } from "../pages/MyOrders";
import { useAuthStore } from "../stores/authStore";
import { useOrderStore } from "../stores/orderStore";

vi.mock("../api/axiosInstance");

describe("MyOrders page integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    useOrderStore.setState({
      orders: [],
      loading: false,
      error: null,
    });
  });

  it("Tizimga kirmagan foydalanuvchiga kirish tugmasini ko'rsatadi", () => {
    render(
      <BrowserRouter>
        <MyOrders />
      </BrowserRouter>
    );

    expect(
      screen.getByText("Buyurtmalarni ko'rish uchun tizimga kiring")
    ).toBeInTheDocument();
    expect(screen.getAllByText("Kirish").length).toBeGreaterThanOrEqual(1);
  });

  it("Foydalanuvchi tizimga kirganida buyurtmalar ro'yxatini va amallarni ko'rsatadi", () => {
    useAuthStore.setState({
      user: {
        id: 1,
        username: "user1",
        email: "user1@test.com",
        fullName: "Test User",
        role: "USER",
        avatar: "",
        enabled: true,
      },
      isAuthenticated: true,
      token: "mock-token",
    });

    useOrderStore.setState({
      orders: [
        {
          id: 1,
          orderNumber: "ORD-USER-777",
          customerName: "Test User",
          customerEmail: "user1@test.com",
          customerPhone: "+998901234567",
          shippingAddress: "Toshkent",
          totalAmount: 120.0,
          status: "PENDING",
          paymentMethod: "CASH_ON_DELIVERY",
          paymentStatus: "PENDING",
          items: [
            {
              id: 1,
              productId: 5,
              productTitle: "Naushnik Pro",
              price: 120.0,
              quantity: 1,
              subtotal: 120.0,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      loading: false,
    });

    render(
      <BrowserRouter>
        <MyOrders />
      </BrowserRouter>
    );

    expect(screen.getByText("Mening buyurtmalarim")).toBeInTheDocument();
    expect(screen.getByText("#ORD-USER-777")).toBeInTheDocument();
    expect(screen.getAllByText("Kutilmoqda").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("$120.00")).toBeInTheDocument();
    expect(screen.getByText("Tafsilotlar")).toBeInTheDocument();
    expect(screen.getByText("Bekor qilish")).toBeInTheDocument();
  });
});
