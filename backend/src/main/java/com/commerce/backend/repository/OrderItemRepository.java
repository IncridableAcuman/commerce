package com.commerce.backend.repository;

import com.commerce.backend.entity.OrderItemEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItemEntity, Long> {
    List<OrderItemEntity> findByOrderId(Long orderId);

    @Query("""
        SELECT item.product.id,
               item.productTitle,
               item.productImageUrl,
               item.price,
               SUM(item.quantity),
               SUM(item.subtotal)
        FROM OrderItemEntity item
        WHERE item.order.status != com.commerce.backend.entity.enums.OrderStatus.CANCELLED
        GROUP BY item.product.id, item.productTitle, item.productImageUrl, item.price
        ORDER BY SUM(item.quantity) DESC
    """)
    List<Object[]> findTopSellingProducts(Pageable pageable);
}

