package com.commerce.backend.service;

import com.commerce.backend.dto.OrderDto.*;
import com.commerce.backend.entity.OrderEntity;
import com.commerce.backend.entity.OrderItemEntity;
import com.commerce.backend.entity.ProductEntity;
import com.commerce.backend.entity.UserEntity;
import com.commerce.backend.entity.enums.OrderStatus;
import com.commerce.backend.entity.enums.PaymentMethod;
import com.commerce.backend.entity.enums.PaymentStatus;
import com.commerce.backend.entity.enums.Role;
import com.commerce.backend.exception.CustomBadRequestException;
import com.commerce.backend.exception.CustomNotFoundException;
import com.commerce.backend.exception.CustomUnauthorizedException;
import com.commerce.backend.repository.OrderRepository;
import com.commerce.backend.repository.ProductRepository;
import com.commerce.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MailService mailService;

    @Mock
    private EmailTemplateService emailTemplateService;

    @InjectMocks
    private OrderService orderService;

    private UserEntity user;
    private ProductEntity product;
    private OrderEntity order;
    private Authentication userAuth;
    private Authentication adminAuth;

    @BeforeEach
    void setUp() {
        user = UserEntity.builder()
                .id(1L)
                .email("user@example.com")
                .fullName("Test User")
                .role(Role.USER)
                .enabled(true)
                .build();

        product = ProductEntity.builder()
                .id(10L)
                .title("iPhone 15 Pro")
                .price(1200.0)
                .stock(5)
                .imageUrl("https://example.com/iphone.jpg")
                .build();

        order = OrderEntity.builder()
                .id(100L)
                .orderNumber("ORD-12345678-9999")
                .user(user)
                .customerName("Test User")
                .customerEmail("user@example.com")
                .customerPhone("+998901234567")
                .shippingAddress("Tashkent, Chilonzor")
                .city("Tashkent")
                .postalCode("100000")
                .totalAmount(1200.0)
                .status(OrderStatus.PENDING)
                .paymentMethod(PaymentMethod.CASH_ON_DELIVERY)
                .paymentStatus(PaymentStatus.PENDING)
                .items(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .build();

        OrderItemEntity item = OrderItemEntity.builder()
                .id(1L)
                .order(order)
                .product(product)
                .productTitle(product.getTitle())
                .productImageUrl(product.getImageUrl())
                .price(1200.0)
                .quantity(1)
                .subtotal(1200.0)
                .build();
        order.getItems().add(item);

        userAuth = new UsernamePasswordAuthenticationToken(
                "user@example.com", null, List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );

        adminAuth = new UsernamePasswordAuthenticationToken(
                "admin@example.com", null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
    }

    @Test
    @DisplayName("createOrder - Muvaffaqiyatli buyurtma yaratish va mahsulot zaxirasini kamaytirish")
    void testCreateOrder_Success() {
        CreateOrderRequest request = CreateOrderRequest.builder()
                .customerName("Test User")
                .customerEmail("user@example.com")
                .customerPhone("+998901234567")
                .shippingAddress("Tashkent, Chilonzor")
                .city("Tashkent")
                .paymentMethod(PaymentMethod.CASH_ON_DELIVERY)
                .items(List.of(new OrderItemRequest(10L, 2)))
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(OrderEntity.class))).thenAnswer(invocation -> {
            OrderEntity saved = invocation.getArgument(0);
            saved.setId(101L);
            return saved;
        });

        OrderResponse response = orderService.createOrder(request, userAuth);

        assertNotNull(response);
        assertEquals(101L, response.getId());
        assertEquals(2400.0, response.getTotalAmount());
        assertEquals(OrderStatus.PENDING, response.getStatus());
        assertEquals(3, product.getStock()); // 5 dan 2 ayirildi

        verify(productRepository, times(1)).save(product);
        verify(orderRepository, times(1)).save(any(OrderEntity.class));
    }

    @Test
    @DisplayName("createOrder - Zaxirada yetarli mahsulot bo'lmaganda CustomBadRequestException")
    void testCreateOrder_InsufficientStock() {
        CreateOrderRequest request = CreateOrderRequest.builder()
                .customerName("Test User")
                .customerEmail("user@example.com")
                .customerPhone("+998901234567")
                .shippingAddress("Tashkent")
                .paymentMethod(PaymentMethod.CARD)
                .items(List.of(new OrderItemRequest(10L, 10))) // mavjud: 5
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));

        assertThrows(CustomBadRequestException.class, () -> orderService.createOrder(request, userAuth));
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("createOrder - Mahsulot topilmaganda CustomNotFoundException")
    void testCreateOrder_ProductNotFound() {
        CreateOrderRequest request = CreateOrderRequest.builder()
                .customerName("Test User")
                .customerEmail("user@example.com")
                .customerPhone("+998901234567")
                .shippingAddress("Tashkent")
                .paymentMethod(PaymentMethod.CARD)
                .items(List.of(new OrderItemRequest(999L, 1)))
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(CustomNotFoundException.class, () -> orderService.createOrder(request, userAuth));
    }

    @Test
    @DisplayName("getOrderById - Egasi o'z buyurtmasini ko'rishi")
    void testGetOrderById_Owner() {
        when(orderRepository.findById(100L)).thenReturn(Optional.of(order));

        OrderResponse response = orderService.getOrderById(100L, userAuth);

        assertNotNull(response);
        assertEquals("ORD-12345678-9999", response.getOrderNumber());
    }

    @Test
    @DisplayName("getOrderById - Admin istalgan buyurtmani ko'rishi")
    void testGetOrderById_Admin() {
        when(orderRepository.findById(100L)).thenReturn(Optional.of(order));

        OrderResponse response = orderService.getOrderById(100L, adminAuth);

        assertNotNull(response);
        assertEquals("ORD-12345678-9999", response.getOrderNumber());
    }

    @Test
    @DisplayName("getOrderById - Boshqa foydalanuvchi ko'rmoqchi bo'lsa CustomUnauthorizedException")
    void testGetOrderById_UnauthorizedOtherUser() {
        Authentication strangerAuth = new UsernamePasswordAuthenticationToken(
                "stranger@example.com", null, List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );

        when(orderRepository.findById(100L)).thenReturn(Optional.of(order));

        assertThrows(CustomUnauthorizedException.class, () -> orderService.getOrderById(100L, strangerAuth));
    }

    @Test
    @DisplayName("getOrderByNumber - Ommaviy kuzatuv kodi orqali buyurtmani olish")
    void testGetOrderByNumber_Success() {
        when(orderRepository.findByOrderNumber("ORD-12345678-9999")).thenReturn(Optional.of(order));

        OrderResponse response = orderService.getOrderByNumber("ORD-12345678-9999");

        assertNotNull(response);
        assertEquals(100L, response.getId());
    }

    @Test
    @DisplayName("getUserOrders - Foydalanuvchining o'z buyurtmalari ro'yxati")
    void testGetUserOrders_Success() {
        Pageable pageable = PageRequest.of(0, 10);
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(orderRepository.findByUserIdOrderByCreatedAtDesc(1L, pageable))
                .thenReturn(new PageImpl<>(List.of(order)));

        Page<OrderResponse> page = orderService.getUserOrders(userAuth, pageable);

        assertEquals(1, page.getTotalElements());
        assertEquals("ORD-12345678-9999", page.getContent().get(0).getOrderNumber());
    }

    @Test
    @DisplayName("updateOrderStatus - Admin statusni o'zgartirishi va yetkazilganda to'lovni tasdiqlashi")
    void testUpdateOrderStatus_Delivered() {
        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest(OrderStatus.DELIVERED, null);

        when(orderRepository.findById(100L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(OrderEntity.class))).thenAnswer(i -> i.getArgument(0));

        OrderResponse response = orderService.updateOrderStatus(100L, request);

        assertEquals(OrderStatus.DELIVERED, response.getStatus());
        assertEquals(PaymentStatus.PAID, response.getPaymentStatus());
    }

    @Test
    @DisplayName("updateOrderStatus - Status CANCELLED qilinganda mahsulot zaxirasini qaytarish")
    void testUpdateOrderStatus_CancelledRestoresStock() {
        product.setStock(4);
        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest(OrderStatus.CANCELLED, null);

        when(orderRepository.findById(100L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(OrderEntity.class))).thenAnswer(i -> i.getArgument(0));

        OrderResponse response = orderService.updateOrderStatus(100L, request);

        assertEquals(OrderStatus.CANCELLED, response.getStatus());
        assertEquals(5, product.getStock()); // 4 + 1 qaytarildi
        verify(productRepository, times(1)).save(product);
    }

    @Test
    @DisplayName("updateOrderStatus - Status CANCELLED dan CONFIRMED ga o'tganda zaxiradan ayirish")
    void testUpdateOrderStatus_UncancellingDeductsStock() {
        order.setStatus(OrderStatus.CANCELLED);
        product.setStock(5);
        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest(OrderStatus.CONFIRMED, null);

        when(orderRepository.findById(100L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(OrderEntity.class))).thenAnswer(i -> i.getArgument(0));

        OrderResponse response = orderService.updateOrderStatus(100L, request);

        assertEquals(OrderStatus.CONFIRMED, response.getStatus());
        assertEquals(4, product.getStock()); // 5 dan 1 ayirildi
        verify(productRepository, times(1)).save(product);
    }

    @Test
    @DisplayName("updateOrderStatus - Status CANCELLED dan qaytganda zaxira yetarli bo'lmasa xatolik")
    void testUpdateOrderStatus_UncancellingInsufficientStockThrowsException() {
        order.setStatus(OrderStatus.CANCELLED);
        product.setStock(0); // zaxira tugagan
        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest(OrderStatus.CONFIRMED, null);

        when(orderRepository.findById(100L)).thenReturn(Optional.of(order));

        assertThrows(CustomBadRequestException.class, () -> orderService.updateOrderStatus(100L, request));
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("cancelOrder - Foydalanuvchi kutilayotgan buyurtmasini bekor qilishi")
    void testCancelOrder_UserSuccess() {
        product.setStock(2);
        when(orderRepository.findById(100L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(OrderEntity.class))).thenAnswer(i -> i.getArgument(0));

        OrderResponse response = orderService.cancelOrder(100L, userAuth);

        assertEquals(OrderStatus.CANCELLED, response.getStatus());
        assertEquals(3, product.getStock());
    }

    @Test
    @DisplayName("getOrderStatistics - Admin statistika ko'rsatkichlari")
    void testGetOrderStatistics() {
        when(orderRepository.count()).thenReturn(10L);
        when(orderRepository.countByStatus(OrderStatus.PENDING)).thenReturn(2L);
        when(orderRepository.countByStatus(OrderStatus.CONFIRMED)).thenReturn(3L);
        when(orderRepository.countByStatus(OrderStatus.PROCESSING)).thenReturn(1L);
        when(orderRepository.countByStatus(OrderStatus.SHIPPED)).thenReturn(2L);
        when(orderRepository.countByStatus(OrderStatus.DELIVERED)).thenReturn(1L);
        when(orderRepository.countByStatus(OrderStatus.CANCELLED)).thenReturn(1L);
        when(orderRepository.calculateTotalRevenue()).thenReturn(15000.50);

        OrderStatisticsResponse stats = orderService.getOrderStatistics();

        assertEquals(10L, stats.getTotalOrders());
        assertEquals(2L, stats.getPendingOrders());
        assertEquals(1L, stats.getDeliveredOrders());
        assertEquals(15000.50, stats.getTotalRevenue());
    }

    @Test
    @DisplayName("getOrderInvoiceHtml - Buyurtma hisob-fakturasini HTML formatida muvaffaqiyatli olish")
    void getOrderInvoiceHtml_Success() {
        when(orderRepository.findByOrderNumber(order.getOrderNumber())).thenReturn(Optional.of(order));
        when(emailTemplateService.processTemplate(eq("order-confirmation-template"), any())).thenReturn("<html>Order Invoice</html>");

        String html = orderService.getOrderInvoiceHtml(order.getOrderNumber());

        assertNotNull(html);
        assertTrue(html.contains("Order Invoice"));
        verify(emailTemplateService, times(1)).processTemplate(eq("order-confirmation-template"), any());
    }
}
