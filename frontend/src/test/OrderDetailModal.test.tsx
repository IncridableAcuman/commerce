import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OrderDetailModal } from "../components/orders/OrderDetailModal";
import type { Order } from "../interfaces/order.interface";

const mockOrder: Order = {
  id: 42,
  orderNumber: "ORD-99999",
  userId: 1,
  customerName: "Jamshid Olimov",
  customerEmail: "jamshid@example.com",
  customerPhone: "+998901234567",
  shippingAddress: "Toshkent shahar, Mirobod tumani, 5-uy",
  city: "Toshkent",
  postalCode: "100015",
  orderNotes: "Eshik oldida qoldiring",
  totalAmount: 350.0,
  status: "PENDING",
  paymentMethod: "CASH_ON_DELIVERY",
  paymentStatus: "PENDING",
  items: [
    {
      id: 1,
      productId: 10,
      productTitle: "Simsiz quloqchin",
      productImageUrl: "https://example.com/earphones.jpg",
      price: 175.0,
      quantity: 2,
      subtotal: 350.0,
    },
  ],
  createdAt: "2026-10-14T10:00:00.000Z",
  updatedAt: "2026-10-14T10:00:00.000Z",
};

describe("OrderDetailModal component", () => {
  it("isOpen=false bo'lganda modal ko'rinmaydi", () => {
    const { container } = render(
      <OrderDetailModal
        order={mockOrder}
        isOpen={false}
        onClose={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("Buyurtma ma'lumotlarini to'liq aks ettiradi", () => {
    render(
      <OrderDetailModal
        order={mockOrder}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText("Buyurtma #ORD-99999")).toBeInTheDocument();
    expect(screen.getByText("Jamshid Olimov")).toBeInTheDocument();
    expect(screen.getByText("+998901234567")).toBeInTheDocument();
    expect(screen.getByText("jamshid@example.com")).toBeInTheDocument();
    expect(screen.getByText("Simsiz quloqchin")).toBeInTheDocument();
    expect(screen.getAllByText("$350.00").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('"Eshik oldida qoldiring"')).toBeInTheDocument();
  });

  it("Yopish tugmasi bosilganda onClose chaqiriladi", () => {
    const handleClose = vi.fn();
    render(
      <OrderDetailModal
        order={mockOrder}
        isOpen={true}
        onClose={handleClose}
      />
    );

    const closeButton = screen.getByText("Yopish");
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
