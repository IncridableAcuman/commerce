package com.commerce.backend.service;

import com.commerce.backend.dto.AnalyticsDto.*;
import com.commerce.backend.entity.OrderEntity;
import com.commerce.backend.entity.ProductEntity;
import com.commerce.backend.entity.enums.OrderStatus;
import com.commerce.backend.entity.enums.Role;
import com.commerce.backend.repository.OrderItemRepository;
import com.commerce.backend.repository.OrderRepository;
import com.commerce.backend.repository.ProductRepository;
import com.commerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;

    @Transactional(readOnly = true)
    public DashboardAnalyticsResponse getDashboardAnalytics() {
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();

        // 1. Overview
        double totalRevenue = Math.round(orderRepository.calculateTotalRevenue() * 100.0) / 100.0;
        long totalOrders = orderRepository.count();
        long totalProducts = productRepository.count();
        long totalUsers = userRepository.count();
        double todayRevenue = Math.round(orderRepository.calculateRevenueAfter(startOfToday) * 100.0) / 100.0;
        long todayOrders = orderRepository.countByCreatedAtAfter(startOfToday);
        long lowStockCount = productRepository.countByStockLessThanEqualAndStockGreaterThan(5, 0);
        long outOfStockCount = productRepository.countByStockEquals(0);
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);

        OverviewStats overview = OverviewStats.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .totalProducts(totalProducts)
                .totalUsers(totalUsers)
                .todayRevenue(todayRevenue)
                .todayOrders(todayOrders)
                .lowStockCount(lowStockCount)
                .outOfStockCount(outOfStockCount)
                .pendingOrders(pendingOrders)
                .build();

        // 2. Orders by Status
        Map<String, Long> ordersByStatus = new LinkedHashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            ordersByStatus.put(status.name(), orderRepository.countByStatus(status));
        }

        // 3. Users by Role
        Map<String, Long> usersByRole = new LinkedHashMap<>();
        for (Role role : Role.values()) {
            usersByRole.put(role.name(), userRepository.countByRole(role));
        }

        // 4. Daily Sales (Oxirgi 7 kun)
        List<DailySalesStat> dailySales = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate today = LocalDate.now();

        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            LocalDateTime start = day.atStartOfDay();
            LocalDateTime end = day.atTime(LocalTime.MAX);

            double revenue = Math.round(orderRepository.calculateRevenueBetween(start, end) * 100.0) / 100.0;
            long count = orderRepository.countOrdersBetween(start, end);

            dailySales.add(DailySalesStat.builder()
                    .date(day.format(formatter))
                    .revenue(revenue)
                    .ordersCount(count)
                    .build());
        }

        // 5. Top Selling Products (Top 5)
        List<TopProductStat> topProducts = new ArrayList<>();
        try {
            List<Object[]> rawTop = orderItemRepository.findTopSellingProducts(PageRequest.of(0, 5));
            for (Object[] row : rawTop) {
                Long productId = row[0] != null ? ((Number) row[0]).longValue() : null;
                String title = row[1] != null ? (String) row[1] : "Noma'lum mahsulot";
                String imageUrl = row[2] != null ? (String) row[2] : null;
                double price = row[3] != null ? ((Number) row[3]).doubleValue() : 0.0;
                long totalSold = row[4] != null ? ((Number) row[4]).longValue() : 0L;
                double revenue = row[5] != null ? Math.round(((Number) row[5]).doubleValue() * 100.0) / 100.0 : 0.0;

                topProducts.add(TopProductStat.builder()
                        .productId(productId)
                        .title(title)
                        .imageUrl(imageUrl)
                        .price(price)
                        .totalSold(totalSold)
                        .totalRevenue(revenue)
                        .build());
            }
        } catch (Exception e) {
            log.warn("Top mahsulotlarni yuklashda ogohlantirish: {}", e.getMessage());
        }

        // 6. Low stock products (Zaxirasi kam qolganlar)
        List<LowStockProductStat> lowStockProducts = new ArrayList<>();
        List<ProductEntity> rawLowStock = productRepository.findTop10ByStockLessThanEqualOrderByStockAsc(5);
        for (ProductEntity p : rawLowStock) {
            lowStockProducts.add(LowStockProductStat.builder()
                    .id(p.getId())
                    .title(p.getTitle())
                    .imageUrl(p.getImageUrl())
                    .price(p.getPrice())
                    .stock(p.getStock())
                    .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                    .build());
        }

        // 7. Recent orders (So'nggi 5 ta buyurtma)
        List<RecentOrderStat> recentOrders = new ArrayList<>();
        List<OrderEntity> rawRecentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc();
        for (OrderEntity o : rawRecentOrders) {
            recentOrders.add(RecentOrderStat.builder()
                    .id(o.getId())
                    .orderNumber(o.getOrderNumber())
                    .customerName(o.getCustomerName())
                    .customerEmail(o.getCustomerEmail())
                    .totalAmount(o.getTotalAmount())
                    .status(o.getStatus())
                    .createdAt(o.getCreatedAt())
                    .build());
        }

        return DashboardAnalyticsResponse.builder()
                .overview(overview)
                .ordersByStatus(ordersByStatus)
                .usersByRole(usersByRole)
                .dailySales(dailySales)
                .topProducts(topProducts)
                .lowStockProducts(lowStockProducts)
                .recentOrders(recentOrders)
                .build();
    }
}
