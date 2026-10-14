import type { OrderStatus } from "./order.interface";
import type { Role } from "./user.interface";

export interface OverviewStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  todayRevenue: number;
  todayOrders: number;
  lowStockCount: number;
  outOfStockCount: number;
  pendingOrders: number;
}

export interface DailySalesStat {
  date: string; // YYYY-MM-DD
  revenue: number;
  ordersCount: number;
}

export interface TopProductStat {
  productId: number;
  title: string;
  imageUrl: string | null;
  price: number;
  totalSold: number;
  totalRevenue: number;
}

export interface LowStockProductStat {
  id: number;
  title: string;
  imageUrl: string | null;
  price: number;
  stock: number;
  categoryName: string | null;
}

export interface RecentOrderStat {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface DashboardAnalyticsResponse {
  overview: OverviewStats;
  ordersByStatus: Record<string, number>;
  usersByRole: Record<Role, number>;
  dailySales: DailySalesStat[];
  topProducts: TopProductStat[];
  lowStockProducts: LowStockProductStat[];
  recentOrders: RecentOrderStat[];
}
