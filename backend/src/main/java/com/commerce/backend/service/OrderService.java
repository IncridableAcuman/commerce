package com.commerce.backend.service;

import com.commerce.backend.dto.EmailPayload;
import com.commerce.backend.dto.OrderDto.*;
import com.commerce.backend.entity.OrderEntity;
import com.commerce.backend.entity.OrderItemEntity;
import com.commerce.backend.entity.ProductEntity;
import com.commerce.backend.entity.UserEntity;
import com.commerce.backend.entity.enums.OrderStatus;
import com.commerce.backend.entity.enums.PaymentMethod;
import com.commerce.backend.entity.enums.PaymentStatus;
import com.commerce.backend.exception.CustomBadRequestException;
import com.commerce.backend.exception.CustomNotFoundException;
import com.commerce.backend.exception.CustomUnauthorizedException;
import com.commerce.backend.repository.OrderRepository;
import com.commerce.backend.repository.ProductRepository;
import com.commerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final MailService mailService;
    private final EmailTemplateService emailTemplateService;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, Authentication authentication) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new CustomBadRequestException("Buyurtmada kamida bitta mahsulot bo'lishi kerak");
        }

        UserEntity currentUser = null;
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            currentUser = userRepository.findByEmail(authentication.getName()).orElse(null);
        }

        List<OrderItemEntity> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        String orderNumber = "ORD-" + System.currentTimeMillis() + "-" + ThreadLocalRandom.current().nextInt(1000, 9999);

        OrderEntity order = OrderEntity.builder()
                .orderNumber(orderNumber)
                .user(currentUser)
                .customerName(request.getCustomerName().trim())
                .customerEmail(request.getCustomerEmail().trim())
                .customerPhone(request.getCustomerPhone().trim())
                .shippingAddress(request.getShippingAddress().trim())
                .city(request.getCity() != null ? request.getCity().trim() : null)
                .postalCode(request.getPostalCode() != null ? request.getPostalCode().trim() : null)
                .orderNotes(request.getOrderNotes() != null ? request.getOrderNotes().trim() : null)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .status(OrderStatus.PENDING)
                .build();

        for (OrderItemRequest itemReq : request.getItems()) {
            ProductEntity product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new CustomNotFoundException("Mahsulot topilmadi (ID: " + itemReq.getProductId() + ")"));

            if (product.getStock() < itemReq.getQuantity()) {
                throw new CustomBadRequestException(
                        "Mahsulot qoldig'i yetarli emas: " + product.getTitle() + " (Mavjud: " + product.getStock() + ")"
                );
            }

            // Kamaytirish
            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);

            double subtotal = product.getPrice() * itemReq.getQuantity();
            totalAmount += subtotal;

            OrderItemEntity orderItem = OrderItemEntity.builder()
                    .order(order)
                    .product(product)
                    .productTitle(product.getTitle())
                    .productImageUrl(product.getImageUrl())
                    .price(product.getPrice())
                    .quantity(itemReq.getQuantity())
                    .subtotal(subtotal)
                    .build();

            orderItems.add(orderItem);
        }

        order.setTotalAmount(Math.round(totalAmount * 100.0) / 100.0);
        order.setItems(orderItems);

        OrderEntity saved = orderRepository.save(order);
        log.info("Yangi buyurtma yaratildi: {}, Jami: ${}", saved.getOrderNumber(), saved.getTotalAmount());

        // HTML formatdagi tasdiqlash xabarnomasini yuborish
        sendOrderConfirmationHtmlEmail(saved);

        return OrderResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id, Authentication authentication) {
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new CustomNotFoundException("Buyurtma topilmadi (ID: " + id + ")"));

        boolean isStaff = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_MANAGER"));
        boolean isOwner = authentication != null && order.getUser() != null &&
                authentication.getName().equals(order.getUser().getEmail());

        if (!isStaff && !isOwner) {
            throw new CustomUnauthorizedException("Ushbu buyurtmani ko'rish uchun ruxsat yo'q");
        }

        return OrderResponse.from(order);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumber(String orderNumber) {
        OrderEntity order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new CustomNotFoundException("Buyurtma topilmadi (" + orderNumber + ")"));
        return OrderResponse.from(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getUserOrders(Authentication authentication, Pageable pageable) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new CustomUnauthorizedException("Avval tizimga kiring");
        }

        UserEntity user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new CustomNotFoundException("Foydalanuvchi topilmadi"));

        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(OrderResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(String search, OrderStatus status, Pageable pageable) {
        boolean hasSearch = search != null && !search.trim().isEmpty();
        boolean hasStatus = status != null;

        Page<OrderEntity> page;
        if (hasSearch && hasStatus) {
            String pattern = "%" + search.trim().toLowerCase() + "%";
            page = orderRepository.findByStatusAndSearch(status, pattern, pageable);
        } else if (hasSearch) {
            String pattern = "%" + search.trim().toLowerCase() + "%";
            page = orderRepository.findBySearch(pattern, pageable);
        } else if (hasStatus) {
            page = orderRepository.findByStatus(status, pageable);
        } else {
            page = orderRepository.findAll(pageable);
        }

        return page.map(OrderResponse::from);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request) {
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new CustomNotFoundException("Buyurtma topilmadi (ID: " + id + ")"));

        OrderStatus oldStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();

        // Agar bekor qilinayotgan bo'lsa, mahsulot zaxirasini qaytarish
        if (oldStatus != OrderStatus.CANCELLED && newStatus == OrderStatus.CANCELLED) {
            restoreStock(order);
        } else if (oldStatus == OrderStatus.CANCELLED && newStatus != OrderStatus.CANCELLED) {
            deductStock(order);
        }

        order.setStatus(newStatus);
        if (request.getPaymentStatus() != null) {
            order.setPaymentStatus(request.getPaymentStatus());
        }

        // Yetkazilgan bo'lsa va to'lov kutilayotgan bo'lsa, to'langan qilib belgilash
        if (newStatus == OrderStatus.DELIVERED && order.getPaymentStatus() == PaymentStatus.PENDING) {
            order.setPaymentStatus(PaymentStatus.PAID);
        }

        OrderEntity saved = orderRepository.save(order);
        log.info("Buyurtma #{} holati o'zgartirildi: {} -> {}", order.getOrderNumber(), oldStatus, newStatus);

        if (oldStatus != newStatus) {
            sendOrderStatusUpdateHtmlEmail(saved, getStatusDescription(newStatus));
        }

        return OrderResponse.from(saved);
    }

    @Transactional
    public OrderResponse cancelOrder(Long id, Authentication authentication) {
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new CustomNotFoundException("Buyurtma topilmadi (ID: " + id + ")"));

        boolean isStaff = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_MANAGER"));
        boolean isOwner = authentication != null && order.getUser() != null &&
                authentication.getName().equals(order.getUser().getEmail());

        if (!isStaff && !isOwner) {
            throw new CustomUnauthorizedException("Buyurtmani bekor qilish uchun ruxsat yo'q");
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new CustomBadRequestException("Buyurtma allaqachon bekor qilingan");
        }

        if (!isStaff && order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new CustomBadRequestException("Faqat kutilayotgan yoki tasdiqlangan buyurtmalarni bekor qilish mumkin");
        }

        restoreStock(order);
        order.setStatus(OrderStatus.CANCELLED);
        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            order.setPaymentStatus(PaymentStatus.REFUNDED);
        }

        OrderEntity saved = orderRepository.save(order);
        log.info("Buyurtma #{} bekor qilindi", order.getOrderNumber());

        sendOrderStatusUpdateHtmlEmail(saved, "Buyurtmangiz bekor qilindi. Agar to'lov oldindan amalga oshirilgan bo'lsa, mablag' qaytariladi.");

        return OrderResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public OrderStatisticsResponse getOrderStatistics() {
        long total = orderRepository.count();
        long pending = orderRepository.countByStatus(OrderStatus.PENDING);
        long confirmed = orderRepository.countByStatus(OrderStatus.CONFIRMED);
        long processing = orderRepository.countByStatus(OrderStatus.PROCESSING);
        long shipped = orderRepository.countByStatus(OrderStatus.SHIPPED);
        long delivered = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long cancelled = orderRepository.countByStatus(OrderStatus.CANCELLED);
        double revenue = Math.round(orderRepository.calculateTotalRevenue() * 100.0) / 100.0;

        return OrderStatisticsResponse.builder()
                .totalOrders(total)
                .pendingOrders(pending)
                .confirmedOrders(confirmed)
                .processingOrders(processing)
                .shippedOrders(shipped)
                .deliveredOrders(delivered)
                .cancelledOrders(cancelled)
                .totalRevenue(revenue)
                .build();
    }

    private void restoreStock(OrderEntity order) {
        if (order.getItems() == null) return;
        for (OrderItemEntity item : order.getItems()) {
            if (item.getProduct() != null) {
                ProductEntity product = item.getProduct();
                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            }
        }
    }

    private void deductStock(OrderEntity order) {
        if (order.getItems() == null) return;
        for (OrderItemEntity item : order.getItems()) {
            if (item.getProduct() != null) {
                ProductEntity product = item.getProduct();
                if (product.getStock() < item.getQuantity()) {
                    throw new CustomBadRequestException(
                            "Mahsulot zaxirasi yetarli emas: " + product.getTitle() + " (Mavjud: " + product.getStock() + ")"
                    );
                }
                product.setStock(product.getStock() - item.getQuantity());
                productRepository.save(product);
            }
        }
    }

    // ==========================================
    // HTML EMAIL & INVOICE METHODS
    // ==========================================

    @Transactional(readOnly = true)
    public String getOrderInvoiceHtml(String orderNumber) {
        OrderEntity order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new CustomNotFoundException("Buyurtma topilmadi (" + orderNumber + ")"));
        Map<String, Object> variables = prepareOrderVariables(order);
        return emailTemplateService.processTemplate("order-confirmation-template", variables);
    }

    public void sendOrderConfirmationHtmlEmail(OrderEntity order) {
        try {
            if (mailService != null && emailTemplateService != null &&
                    order.getCustomerEmail() != null && !order.getCustomerEmail().isBlank()) {
                Map<String, Object> variables = prepareOrderVariables(order);
                String htmlContent = emailTemplateService.processTemplate("order-confirmation-template", variables);
                mailService.sendMessageWithRabbitMq(new EmailPayload(
                        order.getCustomerEmail(),
                        "Buyurtmangiz muvaffaqiyatli qabul qilindi #" + order.getOrderNumber(),
                        htmlContent
                ));
                log.info("Buyurtma #{}: HTML tasdiqlash xabari navbatga yuborildi ({})", order.getOrderNumber(), order.getCustomerEmail());
            }
        } catch (Exception e) {
            log.warn("Buyurtma #{}: HTML email xabarini yuborishda xatolik: {}", order.getOrderNumber(), e.getMessage());
        }
    }

    public void sendOrderStatusUpdateHtmlEmail(OrderEntity order, String description) {
        try {
            if (mailService != null && emailTemplateService != null &&
                    order.getCustomerEmail() != null && !order.getCustomerEmail().isBlank()) {
                Map<String, Object> variables = prepareOrderVariables(order);
                variables.put("statusDescription", description);
                String htmlContent = emailTemplateService.processTemplate("order-status-update-template", variables);
                String subject = "Buyurtma holati yangilandi #" + order.getOrderNumber() + " - " + formatOrderStatus(order.getStatus());
                mailService.sendMessageWithRabbitMq(new EmailPayload(
                        order.getCustomerEmail(),
                        subject,
                        htmlContent
                ));
                log.info("Buyurtma #{}: HTML holat yangilanish xabari navbatga yuborildi ({})", order.getOrderNumber(), order.getCustomerEmail());
            }
        } catch (Exception e) {
            log.warn("Buyurtma #{}: HTML holat yangilanish xabarini yuborishda xatolik: {}", order.getOrderNumber(), e.getMessage());
        }
    }

    private Map<String, Object> prepareOrderVariables(OrderEntity order) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("orderNumber", order.getOrderNumber());
        variables.put("customerName", order.getCustomerName() != null ? order.getCustomerName() : "Hurmatli mijoz");
        variables.put("customerEmail", order.getCustomerEmail());
        variables.put("customerPhone", order.getCustomerPhone());
        variables.put("shippingAddress", order.getShippingAddress());
        variables.put("city", order.getCity());
        variables.put("postalCode", order.getPostalCode());
        variables.put("orderNotes", order.getOrderNotes());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy, HH:mm");
        variables.put("orderDate", order.getCreatedAt() != null ? order.getCreatedAt().format(formatter) : "");
        variables.put("updatedAt", order.getUpdatedAt() != null ? order.getUpdatedAt().format(formatter) : "");

        variables.put("orderStatusText", formatOrderStatus(order.getStatus()));
        variables.put("statusName", order.getStatus() != null ? order.getStatus().name() : "");
        variables.put("paymentMethodText", formatPaymentMethod(order.getPaymentMethod()));
        variables.put("paymentStatusText", formatPaymentStatus(order.getPaymentStatus()));

        double total = order.getTotalAmount();
        variables.put("subtotalAmount", total);
        variables.put("totalAmount", total);

        List<Map<String, Object>> itemsList = new ArrayList<>();
        if (order.getItems() != null) {
            for (OrderItemEntity item : order.getItems()) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("title", item.getProductTitle());
                itemMap.put("price", item.getPrice());
                itemMap.put("quantity", item.getQuantity());
                itemMap.put("subtotal", item.getSubtotal());
                itemMap.put("imageUrl", item.getProductImageUrl());
                itemsList.add(itemMap);
            }
        }
        variables.put("items", itemsList);
        variables.put("trackUrl", "http://localhost:5173/track/" + order.getOrderNumber());

        return variables;
    }

    private String formatOrderStatus(OrderStatus status) {
        if (status == null) return "Noma'lum";
        return switch (status) {
            case PENDING -> "Kutilmoqda";
            case CONFIRMED -> "Tasdiqlandi";
            case PROCESSING -> "Tayyorlanmoqda";
            case SHIPPED -> "Yetkazib berilmoqda";
            case DELIVERED -> "Yetkazib berildi";
            case CANCELLED -> "Bekor qilingan";
        };
    }

    private String formatPaymentMethod(PaymentMethod method) {
        if (method == null) return "Noma'lum";
        return switch (method) {
            case CASH_ON_DELIVERY -> "Naqd pul (qabul qilinganda)";
            case CARD -> "Bank kartasi";
            case PAYME -> "Payme";
            case CLICK -> "Click";
            case UZUM -> "Uzum Pay";
        };
    }

    private String formatPaymentStatus(PaymentStatus status) {
        if (status == null) return "Noma'lum";
        return switch (status) {
            case PENDING -> "To'lov kutilmoqda";
            case PAID -> "To'langan";
            case FAILED -> "To'lovda xatolik";
            case REFUNDED -> "Qaytarilgan";
        };
    }

    private String getStatusDescription(OrderStatus status) {
        if (status == null) return "Buyurtmangiz holati yangilandi.";
        return switch (status) {
            case PENDING -> "Buyurtmangiz tizimda kutilmoqda va tez orada operatorlar tomonidan ko'rib chiqiladi.";
            case CONFIRMED -> "Buyurtmangiz tasdiqlandi va omborga yuborildi.";
            case PROCESSING -> "Mahsulotlaringiz ombordan yig'ilmoqda va jo'natishga tayyorlanmoqda.";
            case SHIPPED -> "Buyurtmangiz kuryerga topshirildi va manzil tomon yo'lga chiqdi.";
            case DELIVERED -> "Buyurtmangiz manzilga muvaffaqiyatli yetkazib berildi. Bizni tanlaganingiz uchun tashakkur!";
            case CANCELLED -> "Buyurtmangiz bekor qilindi. Agar to'lov oldindan amalga oshirilgan bo'lsa, mablag' qaytariladi.";
        };
    }
}
