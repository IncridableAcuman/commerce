package com.commerce.backend.repository;

import com.commerce.backend.entity.OrderEntity;
import com.commerce.backend.entity.enums.OrderStatus;
import com.commerce.backend.entity.enums.PaymentMethod;
import com.commerce.backend.entity.enums.PaymentStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class OrderRepositoryTest {

    @Autowired
    private OrderRepository orderRepository;

    @Test
    @DisplayName("calculateTotalRevenue - Daromadni hisoblash so'rovi to'g'ri ishlashi")
    void testCalculateTotalRevenue() {
        OrderEntity order1 = OrderEntity.builder()
                .orderNumber("TEST-ORD-001")
                .customerName("Ali")
                .customerEmail("ali@test.com")
                .customerPhone("+998901234567")
                .shippingAddress("Toshkent")
                .totalAmount(100.0)
                .status(OrderStatus.DELIVERED)
                .paymentMethod(PaymentMethod.CASH_ON_DELIVERY)
                .paymentStatus(PaymentStatus.PAID)
                .createdAt(LocalDateTime.now())
                .build();

        OrderEntity order2 = OrderEntity.builder()
                .orderNumber("TEST-ORD-002")
                .customerName("Vali")
                .customerEmail("vali@test.com")
                .customerPhone("+998901234568")
                .shippingAddress("Samarqand")
                .totalAmount(200.0)
                .status(OrderStatus.CANCELLED)
                .paymentMethod(PaymentMethod.CARD)
                .paymentStatus(PaymentStatus.REFUNDED)
                .createdAt(LocalDateTime.now())
                .build();

        orderRepository.save(order1);
        orderRepository.save(order2);

        double revenue = orderRepository.calculateTotalRevenue();
        assertTrue(revenue >= 100.0);
    }

    @Test
    @DisplayName("findWithFilters - Filtrlash va qidiruv so'rovi to'g'ri ishlashi")
    void testFindWithFilters() {
        OrderEntity order = OrderEntity.builder()
                .orderNumber("TEST-ORD-003")
                .customerName("G'ani")
                .customerEmail("gani@test.com")
                .customerPhone("+998901234569")
                .shippingAddress("Buxoro")
                .totalAmount(350.0)
                .status(OrderStatus.CONFIRMED)
                .paymentMethod(PaymentMethod.PAYME)
                .paymentStatus(PaymentStatus.PAID)
                .createdAt(LocalDateTime.now())
                .build();

        orderRepository.save(order);

        Page<OrderEntity> page = orderRepository.findWithFilters("TEST-ORD-003", OrderStatus.CONFIRMED, PageRequest.of(0, 10));
        assertFalse(page.isEmpty());
        assertEquals("TEST-ORD-003", page.getContent().get(0).getOrderNumber());
    }
}
