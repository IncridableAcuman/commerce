import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderTimeline } from "../components/orders/OrderTimeline";

describe("OrderTimeline", () => {
  it("Oddiy holatda barcha qadamlarni ko'rsatadi", () => {
    render(<OrderTimeline status="PROCESSING" />);
    expect(screen.getByText("Qabul qilindi")).toBeInTheDocument();
    expect(screen.getByText("Tasdiqlandi")).toBeInTheDocument();
    expect(screen.getByText("Tayyorlanmoqda")).toBeInTheDocument();
    expect(screen.getByText("Yo'lda")).toBeInTheDocument();
    expect(screen.getByText("Yetkazildi")).toBeInTheDocument();
  });

  it("CANCELLED holatida bekor qilinganlik xabarini ko'rsatadi", () => {
    render(<OrderTimeline status="CANCELLED" />);
    expect(screen.getByText("Buyurtma bekor qilingan")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ushbu buyurtma bekor qilingan va mahsulotlar zaxiraga qaytarilgan."
      )
    ).toBeInTheDocument();
  });
});
