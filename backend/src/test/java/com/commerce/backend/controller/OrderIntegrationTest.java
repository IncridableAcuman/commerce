package com.commerce.backend.controller;

import com.commerce.backend.dto.OrderDto.*;
import com.commerce.backend.entity.OrderEntity;
import com.commerce.backend.entity.ProductCategoryEntity;
import com.commerce.backend.entity.ProductEntity;
import com.commerce.backend.entity.UserEntity;
import com.commerce.backend.entity.enums.OrderStatus;
import com.commerce.backend.entity.enums.PaymentMethod;
import com.commerce.backend.entity.enums.PaymentStatus;
import com.commerce.backend.entity.enums.Role;
import com.commerce.backend.repository.OrderItemRepository;
import com.commerce.backend.repository.OrderRepository;
import com.commerce.backend.repository.ProductCategoryRepository;
import com.commerce.backend.repository.ProductRepository;
import com.commerce.backend.repository.UserRepository;
import com.commerce.backend.service.MailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class OrderIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @MockitoBean
    private MailService mailService;

    private UserEntity testUser;
    private ProductEntity testProduct;
    private ProductCategoryEntity testCategory;

    @BeforeEach
    void setUp() {
        orderItemRepository.deleteAll();
        orderRepository.deleteAll();

        testUser = userRepository.findByEmail("buyer@integration.com")
                .orElseGet(() -> userRepository.save(UserEntity.builder()
                        .username("buyer123")
                        .email("buyer@integration.com")
                        .fullName("Xaridor Test")
                        .password("hash123")
                        .role(Role.USER)
                        .enabled(true)
                        .build()));

        testCategory = categoryRepository.findByNameIgnoreCase("Elektronika")
                .orElseGet(() -> categoryRepository.save(ProductCategoryEntity.builder()
                        .name("Elektronika")
                        .build()));

        testProduct = productRepository.findAll().stream()
                .filter(p -> "MacBook Air M3".equals(p.getTitle()))
                .findFirst()
                .orElseGet(() -> productRepository.save(ProductEntity.builder()
                        .title("MacBook Air M3")
                        .content("Yengil va kuchli noutbuk")
                        .price(1100.0)
                        .stock(10)
                        .category(testCategory)
                        .build()));

        testProduct.setStock(10);
        productRepository.save(testProduct);
    }

    @Test
    @WithMockUser(username = "buyer@integration.com", roles = "USER")
    @DisplayName("Integratsiya: Buyurtma yaratish -> Zaxira kamayishi -> Buyurtmani bekor qilish -> Zaxira tiklanishi")
    void testOrderCreationAndCancellationFlow() throws Exception {
        CreateOrderRequest request = CreateOrderRequest.builder()
                .customerName("Xaridor Test")
                .customerEmail("buyer@integration.com")
                .customerPhone("+998901112233")
                .shippingAddress("Toshkent sh., Navoiy ko'chasi 1")
                .city("Toshkent")
                .paymentMethod(PaymentMethod.CASH_ON_DELIVERY)
                .items(List.of(new OrderItemRequest(testProduct.getId(), 2)))
                .build();

        // 1. Buyurtma yaratish
        MvcResult createResult = mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderNumber").isNotEmpty())
                .andExpect(jsonPath("$.totalAmount").value(2200.0))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andReturn();

        OrderResponse createdOrder = objectMapper.readValue(
                createResult.getResponse().getContentAsString(),
                OrderResponse.class
        );

        // 2. Mahsulot zaxirasi tekshiriladi (10 dan 2 ayirilib, 8 bo'lishi kerak)
        ProductEntity updatedProduct = productRepository.findById(testProduct.getId()).orElseThrow();
        assertEquals(8, updatedProduct.getStock());

        // 3. O'z buyurtmalarini olish (/orders/my)
        mockMvc.perform(get("/orders/my"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].orderNumber").value(createdOrder.getOrderNumber()))
                .andExpect(jsonPath("$.content[0].totalAmount").value(2200.0));

        // 4. Ommaviy kuzatuv (/orders/track/{orderNumber})
        mockMvc.perform(get("/orders/track/" + createdOrder.getOrderNumber()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(createdOrder.getId()))
                .andExpect(jsonPath("$.status").value("PENDING"));

        // 5. Foydalanuvchi buyurtmani bekor qilishi
        mockMvc.perform(put("/orders/" + createdOrder.getId() + "/cancel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));

        // 6. Mahsulot zaxirasi qayta tiklanishi tekshiriladi (8 + 2 = 10)
        ProductEntity restoredProduct = productRepository.findById(testProduct.getId()).orElseThrow();
        assertEquals(10, restoredProduct.getStock());
    }

    @Test
    @WithMockUser(username = "admin@integration.com", roles = "ADMIN")
    @DisplayName("Integratsiya: Admin buyurtma holatini yangilashi va statistikani ko'rishi")
    void testAdminOrderStatusAndStatistics() throws Exception {
        OrderEntity order = orderRepository.save(OrderEntity.builder()
                .orderNumber("ORD-ADMIN-TEST")
                .user(testUser)
                .customerName("Mijoz")
                .customerEmail("client@test.com")
                .customerPhone("+998901234567")
                .shippingAddress("Farg'ona")
                .totalAmount(500.0)
                .status(OrderStatus.PENDING)
                .paymentMethod(PaymentMethod.CASH_ON_DELIVERY)
                .paymentStatus(PaymentStatus.PENDING)
                .build());

        // 1. Admin ro'yxatni olish
        mockMvc.perform(get("/orders/admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].orderNumber").value("ORD-ADMIN-TEST"));

        // 2. Admin statusni DELIVERED ga o'zgartiradi
        UpdateOrderStatusRequest updateReq = new UpdateOrderStatusRequest(OrderStatus.DELIVERED, null);
        mockMvc.perform(put("/orders/admin/" + order.getId() + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DELIVERED"))
                .andExpect(jsonPath("$.paymentStatus").value("PAID"));

        // 3. Admin statistikani oladi
        mockMvc.perform(get("/orders/admin/statistics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalOrders").value(1))
                .andExpect(jsonPath("$.deliveredOrders").value(1))
                .andExpect(jsonPath("$.totalRevenue").value(500.0));
    }
}
