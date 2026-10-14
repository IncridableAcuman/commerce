import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Checkout } from "../pages/Checkout";
import { useCartStore } from "../stores/cartStore";
import { useOrderStore } from "../stores/orderStore";
import { useAuthStore } from "../stores/authStore";

vi.mock("../api/axiosInstance");

describe("Checkout page integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCartStore.setState({
      items: [],
      isCartOpen: false,
    });
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  });

  it("Savat bo'sh bo'lganda ogohlantirish xabarini ko'rsatadi", () => {
    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    expect(screen.getByText("Savatingiz bo'sh")).toBeInTheDocument();
    expect(screen.getByText("Katalogga qaytish")).toBeInTheDocument();
  });

  it("Savatda mahsulot bo'lganda forma va narxlarni ko'rsatadi", () => {
    useCartStore.setState({
      items: [
        {
          product: {
            id: 1,
            title: "PlayStation 5",
            content: "O'yin konsoli",
            price: 500.0,
            imageUrl: "https://example.com/ps5.jpg",
            stock: 5,
            rating: 4.8,
            categoryId: 1,
            categoryName: "Elektronika",
            createdAt: "",
            updatedAt: "",
          },
          quantity: 2,
        },
      ],
    });

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    expect(screen.getByText("Buyurtmani rasmiylashtirish")).toBeInTheDocument();
    expect(screen.getByText("PlayStation 5")).toBeInTheDocument();
    expect(screen.getByText("Yetkazib berish ma'lumotlari")).toBeInTheDocument();
    expect(screen.getByText("Buyurtmani tasdiqlash")).toBeInTheDocument();
  });

  it("Avtorizatsiyadan o'tgan foydalanuvchi ma'lumotlarini avtomatik to'ldiradi", () => {
    useAuthStore.setState({
      user: {
        id: 1,
        username: "anvarbek",
        email: "anvar@mail.com",
        fullName: "Anvar Karimov",
        role: "USER",
        avatar: "",
        enabled: true,
      },
      isAuthenticated: true,
      token: "mock-token",
    });

    useCartStore.setState({
      items: [
        {
          product: {
            id: 1,
            title: "Smart Watch",
            content: "Aqlli soat",
            price: 150.0,
            stock: 10,
            rating: 5,
            categoryId: 1,
            categoryName: "Gadget",
            createdAt: "",
            updatedAt: "",
          },
          quantity: 1,
        },
      ],
    });

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    const nameInput = screen.getByPlaceholderText("Masalan: Azizbek Karimov") as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText("azizbek@gmail.com") as HTMLInputElement;

    expect(nameInput.value).toBe("Anvar Karimov");
    expect(emailInput.value).toBe("anvar@mail.com");
  });
});
