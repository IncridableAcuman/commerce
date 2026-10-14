package com.commerce.backend.dto;

import com.commerce.backend.entity.enums.OrderStatus;
import com.commerce.backend.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class AnalyticsDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OverviewStats {
        private double totalRevenue;
        private long totalOrders;
        private long totalProducts;
        private long totalUsers;
        private double todayRevenue;
        private long todayOrders;
        private long lowStockCount;
        private long outOfStockCount;
        private long pendingOrders;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DailySalesStat {
        private String date; // YYYY-MM-DD
        private double revenue;
        private long ordersCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TopProductStat {
        private Long productId;
        private String title;
        private String imageUrl;
        private double price;
        private long totalSold;
        private double totalRevenue;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LowStockProductStat {
        private Long id;
        private String title;
        private String imageUrl;
        private double price;
        private int stock;
        private String categoryName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecentOrderStat {
        private Long id;
        private String orderNumber;
        private String customerName;
        private String customerEmail;
        private double totalAmount;
        private OrderStatus status;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DashboardAnalyticsResponse {
        private OverviewStats overview;
        private Map<String, Long> ordersByStatus;
        private Map<String, Long> usersByRole;
        private List<DailySalesStat> dailySales;
        private List<TopProductStat> topProducts;
        private List<LowStockProductStat> lowStockProducts;
        private List<RecentOrderStat> recentOrders;
    }
}
