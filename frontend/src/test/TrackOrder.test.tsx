import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { TrackOrder } from "../pages/TrackOrder";
import { useOrderStore } from "../stores/orderStore";
import api from "../api/axiosInstance";

vi.mock("../api/axiosInstance");

describe("TrackOrder page integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useOrderStore.setState({
      currentOrder: null,
      loading: false,
      error: null,
    });
  });

  it("Sahifa sarlavhasi va qidiruv maydonini aks ettiradi", () => {
    render(
      <BrowserRouter>
        <TrackOrder />
      </BrowserRouter>
    );

    expect(screen.getByText("Buyurtmangizni kuzating")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("ORD-1728900000000-1234...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Kuzatish" })).toBeInTheDocument();
  });

  it("Buyurtma raqami kiritilib qidirilganda buyurtma tafsilotlarini va timelineni ko'rsatadi", async () => {
    const mockTrackedOrder = {
      id: 5,
      orderNumber: "ORD-987654321",
      customerName: "Bobur Mirzo",
      customerEmail: "bobur@mail.com",
      customerPhone: "+998901112233",
      shippingAddress: "Andijon sh., Bobur shoh ko'chasi",
      city: "Andijon",
      totalAmount: 99.0,
      status: "SHIPPED",
      paymentMethod: "PAYME",
      paymentStatus: "PAID",
      items: [
        {
          id: 1,
          productId: 7,
          productTitle: "Simsiz Sichqoncha",
          price: 99.0,
          quantity: 1,
          subtotal: 99.0,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    vi.mocked(api.get).mockResolvedValueOnce({ data: mockTrackedOrder });

    render(
      <BrowserRouter>
        <TrackOrder />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText("ORD-1728900000000-1234...");
    const submitBtn = screen.getByRole("button", { name: "Kuzatish" });

    fireEvent.change(input, { target: { value: "ORD-987654321" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("#ORD-987654321")).toBeInTheDocument();
    });

    expect(screen.getByText("Bobur Mirzo")).toBeInTheDocument();
    expect(screen.getByText("Simsiz Sichqoncha")).toBeInTheDocument();
    expect(screen.getAllByText("$99.00").length).toBeGreaterThanOrEqual(1);
  });
});
