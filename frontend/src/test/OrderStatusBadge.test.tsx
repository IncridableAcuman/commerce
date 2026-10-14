import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "../components/orders/OrderStatusBadge";

describe("OrderStatusBadge & PaymentStatusBadge", () => {
  it("PENDING statusi uchun 'Kutilmoqda' yozuvini chiqaradi", () => {
    render(<OrderStatusBadge status="PENDING" />);
    expect(screen.getByText("Kutilmoqda")).toBeInTheDocument();
  });

  it("CONFIRMED statusi uchun 'Tasdiqlandi' yozuvini chiqaradi", () => {
    render(<OrderStatusBadge status="CONFIRMED" />);
    expect(screen.getByText("Tasdiqlandi")).toBeInTheDocument();
  });

  it("SHIPPED statusi uchun 'Yo'lda' yozuvini chiqaradi", () => {
    render(<OrderStatusBadge status="SHIPPED" />);
    expect(screen.getByText("Yo'lda")).toBeInTheDocument();
  });

  it("DELIVERED statusi uchun 'Yetkazildi' yozuvini chiqaradi", () => {
    render(<OrderStatusBadge status="DELIVERED" />);
    expect(screen.getByText("Yetkazildi")).toBeInTheDocument();
  });

  it("CANCELLED statusi uchun 'Bekor qilindi' yozuvini chiqaradi", () => {
    render(<OrderStatusBadge status="CANCELLED" />);
    expect(screen.getByText("Bekor qilindi")).toBeInTheDocument();
  });

  it("PaymentStatusBadge PAID uchun 'To'langan' yozuvini chiqaradi", () => {
    render(<PaymentStatusBadge status="PAID" />);
    expect(screen.getByText("To'langan")).toBeInTheDocument();
  });

  it("PaymentStatusBadge PENDING uchun 'Kutilmoqda' yozuvini chiqaradi", () => {
    render(<PaymentStatusBadge status="PENDING" />);
    expect(screen.getByText("Kutilmoqda")).toBeInTheDocument();
  });
});
