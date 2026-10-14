package com.commerce.backend.controller;

import com.commerce.backend.dto.OrderDto.*;
import com.commerce.backend.entity.enums.OrderStatus;
import com.commerce.backend.entity.enums.PaymentMethod;
import com.commerce.backend.entity.enums.PaymentStatus;
import com.commerce.backend.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private OrderService orderService;

    private OrderResponse sampleResponse() {
        return OrderResponse.builder()
                .id(1L)
                .orderNumber("ORD-1728900000000-1234")
                .userId(1L)
                .customerName("Ali Valiyev")
                .customerEmail("ali@example.com")
                .customerPhone("+998901234567")
                .shippingAddress("Toshkent shahar, Yunusobod")
                .city("Toshkent")
                .postalCode("100000")
                .totalAmount(450.0)
                .status(OrderStatus.PENDING)
                .paymentMethod(PaymentMethod.CASH_ON_DELIVERY)
                .paymentStatus(PaymentStatus.PENDING)
                .items(List.of(
                        OrderItemResponse.builder()
                                .id(1L)
                                .productId(10L)
                                .productTitle("AirPods Pro 2")
                                .price(225.0)
                                .quantity(2)
                                .subtotal(450.0)
                                .build()
                ))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("POST /orders - Buyurtma yaratish (Ommaviy/Foydalanuvchi) 201 Created")
    void testCreateOrder_Success() throws Exception {
        CreateOrderRequest request = CreateOrderRequest.builder()
                .customerName("Ali Valiyev")
                .customerEmail("ali@example.com")
                .customerPhone("+998901234567")
                .shippingAddress("Toshkent shahar, Yunusobod")
                .paymentMethod(PaymentMethod.CASH_ON_DELIVERY)
                .items(List.of(new OrderItemRequest(10L, 2)))
                .build();

        when(orderService.createOrder(any(CreateOrderRequest.class), any()))
                .thenReturn(sampleResponse());

        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.orderNumber").value("ORD-1728900000000-1234"))
                .andExpect(jsonPath("$.totalAmount").value(450.0));
    }

    @Test
    @DisplayName("POST /orders - Noto'g'ri maydonlar yuborilganda 400 Bad Request")
    void testCreateOrder_ValidationError() throws Exception {
        CreateOrderRequest request = CreateOrderRequest.builder()
                .customerName("") // bo'sh ism
                .customerEmail("not-an-email") // noto'g'ri email
                .items(List.of())
                .build();

        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "ali@example.com", roles = {"USER"})
    @DisplayName("GET /orders/my - Tizimga kirgan foydalanuvchi buyurtmalarini olish 200 OK")
    void testGetMyOrders_Authenticated() throws Exception {
        when(orderService.getUserOrders(any(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(sampleResponse())));

        mockMvc.perform(get("/orders/my"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].orderNumber").value("ORD-1728900000000-1234"));
    }

    @Test
    @DisplayName("GET /orders/my - Autentifikatsiyasiz so'rov 401 Unauthorized")
    void testGetMyOrders_Unauthenticated() throws Exception {
        mockMvc.perform(get("/orders/my"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /orders/track/{orderNumber} - Ommaviy buyurtma kuzatish 200 OK")
    void testTrackOrder_Public() throws Exception {
        when(orderService.getOrderByNumber("ORD-1728900000000-1234"))
                .thenReturn(sampleResponse());

        mockMvc.perform(get("/orders/track/ORD-1728900000000-1234"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderNumber").value("ORD-1728900000000-1234"));
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    @DisplayName("GET /orders/admin - Admin buyurtmalar ro'yxatini olish 200 OK")
    void testGetAllOrdersAdmin_Success() throws Exception {
        when(orderService.getAllOrders(any(), any(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(sampleResponse())));

        mockMvc.perform(get("/orders/admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1L));
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    @DisplayName("GET /orders/admin - Oddiy foydalanuvchi uchun 403 Forbidden")
    void testGetAllOrdersAdmin_ForbiddenForRegularUser() throws Exception {
        mockMvc.perform(get("/orders/admin"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    @DisplayName("GET /orders/admin/statistics - Admin statistikalari 200 OK")
    void testGetOrderStatistics_Admin() throws Exception {
        OrderStatisticsResponse stats = OrderStatisticsResponse.builder()
                .totalOrders(25)
                .pendingOrders(5)
                .deliveredOrders(18)
                .totalRevenue(5200.0)
                .build();

        when(orderService.getOrderStatistics()).thenReturn(stats);

        mockMvc.perform(get("/orders/admin/statistics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalOrders").value(25))
                .andExpect(jsonPath("$.totalRevenue").value(5200.0));
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    @DisplayName("PUT /orders/admin/{id}/status - Admin status yangilashi 200 OK")
    void testUpdateOrderStatus_Admin() throws Exception {
        UpdateOrderStatusRequest updateReq = new UpdateOrderStatusRequest(OrderStatus.SHIPPED, PaymentStatus.PAID);
        OrderResponse updated = sampleResponse();
        updated.setStatus(OrderStatus.SHIPPED);
        updated.setPaymentStatus(PaymentStatus.PAID);

        when(orderService.updateOrderStatus(eq(1L), any(UpdateOrderStatusRequest.class)))
                .thenReturn(updated);

        mockMvc.perform(put("/orders/admin/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SHIPPED"))
                .andExpect(jsonPath("$.paymentStatus").value("PAID"));
    }

    @Test
    @DisplayName("GET /orders/track/{orderNumber}/invoice-html - Buyurtma hisob-fakturasini HTML formatda olish")
    void testGetOrderInvoiceHtml() throws Exception {
        when(orderService.getOrderInvoiceHtml("ORD-1728900000000-1234"))
                .thenReturn("<html><body>Buyurtmangiz qabul qilindi</body></html>");

        mockMvc.perform(get("/orders/track/ORD-1728900000000-1234/invoice-html"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_HTML))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Buyurtmangiz qabul qilindi")));
    }
}
