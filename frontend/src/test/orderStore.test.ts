import { describe, it, expect, vi, beforeEach } from "vitest";
import { useOrderStore } from "../stores/orderStore";
import api from "../api/axiosInstance";
import type { Order, CreateOrderRequest } from "../interfaces/order.interface";

vi.mock("../api/axiosInstance");

describe("Order Store (Zustand)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useOrderStore.setState({
      orders: [],
      adminOrders: [],
      currentOrder: null,
      statistics: null,
      loading: false,
      adminLoading: false,
      error: null,
      totalPages: 0,
      totalElements: 0,
    });
  });

  const mockOrder: Order = {
    id: 1,
    orderNumber: "ORD-12345",
    userId: 10,
    customerName: "Ali Valiyev",
    customerEmail: "ali@gmail.com",
    customerPhone: "+998901234567",
    shippingAddress: "Toshkent, Chilonzor",
    city: "Toshkent",
    totalAmount: 150.0,
    status: "PENDING",
    paymentMethod: "CASH_ON_DELIVERY",
    paymentStatus: "PENDING",
    items: [
      {
        id: 101,
        productId: 5,
        productTitle: "Smart Watch",
        price: 150.0,
        quantity: 1,
        subtotal: 150.0,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("createOrder - yangi buyurtma yaratadi va ro'yxatga qo'shadi", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: mockOrder });

    const req: CreateOrderRequest = {
      customerName: "Ali Valiyev",
      customerEmail: "ali@gmail.com",
      customerPhone: "+998901234567",
      shippingAddress: "Toshkent, Chilonzor",
      paymentMethod: "CASH_ON_DELIVERY",
      items: [{ productId: 5, quantity: 1 }],
    };

    const result = await useOrderStore.getState().createOrder(req);

    expect(api.post).toHaveBeenCalledWith("/orders", req);
    expect(result).toEqual(mockOrder);
    expect(useOrderStore.getState().orders).toContainEqual(mockOrder);
    expect(useOrderStore.getState().currentOrder).toEqual(mockOrder);
  });

  it("fetchMyOrders - foydalanuvchi buyurtmalarini yuklaydi", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        content: [mockOrder],
        totalPages: 1,
        totalElements: 1,
      },
    });

    await useOrderStore.getState().fetchMyOrders(0, 10);

    expect(api.get).toHaveBeenCalledWith("/orders/my", {
      params: { page: 0, size: 10 },
    });
    expect(useOrderStore.getState().orders).toHaveLength(1);
    expect(useOrderStore.getState().totalElements).toBe(1);
  });

  it("trackOrderByNumber - ommaviy buyurtmani kodi orqali qidiradi", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockOrder });

    const result = await useOrderStore.getState().trackOrderByNumber("ORD-12345");

    expect(api.get).toHaveBeenCalledWith("/orders/track/ORD-12345");
    expect(result.orderNumber).toBe("ORD-12345");
    expect(useOrderStore.getState().currentOrder).toEqual(mockOrder);
  });

  it("cancelOrder - buyurtmani bekor qiladi va holatni yangilaydi", async () => {
    useOrderStore.setState({ orders: [mockOrder] });

    const cancelledOrder: Order = { ...mockOrder, status: "CANCELLED" };
    vi.mocked(api.put).mockResolvedValueOnce({ data: cancelledOrder });

    const result = await useOrderStore.getState().cancelOrder(1);

    expect(api.put).toHaveBeenCalledWith("/orders/1/cancel");
    expect(result.status).toBe("CANCELLED");
    expect(useOrderStore.getState().orders[0].status).toBe("CANCELLED");
  });

  it("updateAdminOrderStatus - admin buyurtma holatini yangilaydi", async () => {
    useOrderStore.setState({ adminOrders: [mockOrder] });

    const updatedOrder: Order = {
      ...mockOrder,
      status: "DELIVERED",
      paymentStatus: "PAID",
    };
    vi.mocked(api.put).mockResolvedValueOnce({ data: updatedOrder });

    const result = await useOrderStore
      .getState()
      .updateAdminOrderStatus(1, "DELIVERED", "PAID");

    expect(api.put).toHaveBeenCalledWith("/orders/admin/1/status", {
      status: "DELIVERED",
      paymentStatus: "PAID",
    });
    expect(result.status).toBe("DELIVERED");
    expect(useOrderStore.getState().adminOrders[0].status).toBe("DELIVERED");
  });
});
