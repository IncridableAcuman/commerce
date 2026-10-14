package com.commerce.backend.repository;

import com.commerce.backend.entity.OrderEntity;
import com.commerce.backend.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

    Page<OrderEntity> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Optional<OrderEntity> findByOrderNumber(String orderNumber);

    Page<OrderEntity> findByStatus(OrderStatus status, Pageable pageable);

    @Query("""
        SELECT o FROM OrderEntity o 
        WHERE LOWER(o.orderNumber) LIKE :pattern
           OR LOWER(o.customerName) LIKE :pattern
           OR LOWER(o.customerEmail) LIKE :pattern
           OR LOWER(o.customerPhone) LIKE :pattern
    """)
    Page<OrderEntity> findBySearch(@Param("pattern") String pattern, Pageable pageable);

    @Query("""
        SELECT o FROM OrderEntity o 
        WHERE o.status = :status
          AND (LOWER(o.orderNumber) LIKE :pattern
           OR LOWER(o.customerName) LIKE :pattern
           OR LOWER(o.customerEmail) LIKE :pattern
           OR LOWER(o.customerPhone) LIKE :pattern)
    """)
    Page<OrderEntity> findByStatusAndSearch(
            @Param("status") OrderStatus status,
            @Param("pattern") String pattern,
            Pageable pageable
    );

    @Query("""
        SELECT o FROM OrderEntity o 
        WHERE (:status IS NULL OR o.status = :status)
          AND (:search IS NULL OR (
               LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', CAST(:search AS String), '%'))
               OR LOWER(o.customerName) LIKE LOWER(CONCAT('%', CAST(:search AS String), '%'))
               OR LOWER(o.customerEmail) LIKE LOWER(CONCAT('%', CAST(:search AS String), '%'))
               OR LOWER(o.customerPhone) LIKE LOWER(CONCAT('%', CAST(:search AS String), '%'))
          ))
    """)
    Page<OrderEntity> findWithFilters(
            @Param("search") String search,
            @Param("status") OrderStatus status,
            Pageable pageable
    );

    long countByStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM OrderEntity o WHERE o.status != com.commerce.backend.entity.enums.OrderStatus.CANCELLED")
    double calculateTotalRevenue();

    long countByCreatedAtAfter(java.time.LocalDateTime dateTime);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM OrderEntity o WHERE o.status != com.commerce.backend.entity.enums.OrderStatus.CANCELLED AND o.createdAt >= :after")
    double calculateRevenueAfter(@Param("after") java.time.LocalDateTime after);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM OrderEntity o WHERE o.status != com.commerce.backend.entity.enums.OrderStatus.CANCELLED AND o.createdAt >= :start AND o.createdAt < :end")
    double calculateRevenueBetween(@Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end);

    @Query("SELECT COUNT(o) FROM OrderEntity o WHERE o.createdAt >= :start AND o.createdAt < :end")
    long countOrdersBetween(@Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end);

    java.util.List<OrderEntity> findTop5ByOrderByCreatedAtDesc();
}

