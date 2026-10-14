package com.commerce.backend.dto;

import com.commerce.backend.entity.OrderEntity;
import com.commerce.backend.entity.OrderItemEntity;
import com.commerce.backend.entity.enums.OrderStatus;
import com.commerce.backend.entity.enums.PaymentMethod;
import com.commerce.backend.entity.enums.PaymentStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateOrderRequest {
        @NotBlank(message = "Mijoz ismi kiritilishi shart")
        private String customerName;

        @NotBlank(message = "Email kiritilishi shart")
        @Email(message = "Yaroqli email kiriting")
        private String customerEmail;

        @NotBlank(message = "Telefon raqami kiritilishi shart")
        private String customerPhone;

        @NotBlank(message = "Yetkazib berish manzili kiritilishi shart")
        private String shippingAddress;

        private String city;
        private String postalCode;
        private String orderNotes;

        @NotNull(message = "To'lov usuli tanlanishi shart")
        private PaymentMethod paymentMethod;

        @NotEmpty(message = "Buyurtmada kamida bitta mahsulot bo'lishi kerak")
        @Valid
        private List<OrderItemRequest> items;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemRequest {
        @NotNull(message = "Mahsulot ID kiritilishi shart")
        private Long productId;

        @Min(value = 1, message = "Miqdor kamida 1 bo'lishi kerak")
        private int quantity;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateOrderStatusRequest {
        @NotNull(message = "Status tanlanishi shart")
        private OrderStatus status;

        private PaymentStatus paymentStatus;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderResponse {
        private Long id;
        private String orderNumber;
        private Long userId;
        private String customerName;
        private String customerEmail;
        private String customerPhone;
        private String shippingAddress;
        private String city;
        private String postalCode;
        private String orderNotes;
        private double totalAmount;
        private OrderStatus status;
        private PaymentMethod paymentMethod;
        private PaymentStatus paymentStatus;
        private List<OrderItemResponse> items;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static OrderResponse from(OrderEntity order) {
            return OrderResponse.builder()
                    .id(order.getId())
                    .orderNumber(order.getOrderNumber())
                    .userId(order.getUser() != null ? order.getUser().getId() : null)
                    .customerName(order.getCustomerName())
                    .customerEmail(order.getCustomerEmail())
                    .customerPhone(order.getCustomerPhone())
                    .shippingAddress(order.getShippingAddress())
                    .city(order.getCity())
                    .postalCode(order.getPostalCode())
                    .orderNotes(order.getOrderNotes())
                    .totalAmount(order.getTotalAmount())
                    .status(order.getStatus())
                    .paymentMethod(order.getPaymentMethod())
                    .paymentStatus(order.getPaymentStatus())
                    .items(order.getItems() != null ? order.getItems().stream().map(OrderItemResponse::from).toList() : List.of())
                    .createdAt(order.getCreatedAt())
                    .updatedAt(order.getUpdatedAt())
                    .build();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private String productTitle;
        private String productImageUrl;
        private double price;
        private int quantity;
        private double subtotal;

        public static OrderItemResponse from(OrderItemEntity item) {
            return OrderItemResponse.builder()
                    .id(item.getId())
                    .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                    .productTitle(item.getProductTitle())
                    .productImageUrl(item.getProductImageUrl())
                    .price(item.getPrice())
                    .quantity(item.getQuantity())
                    .subtotal(item.getSubtotal())
                    .build();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderStatisticsResponse {
        private long totalOrders;
        private long pendingOrders;
        private long confirmedOrders;
        private long processingOrders;
        private long shippedOrders;
        private long deliveredOrders;
        private long cancelledOrders;
        private double totalRevenue;
    }
}
