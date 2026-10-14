package com.commerce.backend.dto;

import com.commerce.backend.entity.ProductEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class ProductDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Content is required")
        private String content;

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        private Double price;

        private String imageUrl;

        private Integer stock;

        private Long categoryId;
    }

    public record ProductResponse(
            Long id,
            String title,
            String content,
            double price,
            String imageUrl,
            int stock,
            double rating,
            Long categoryId,
            String categoryName,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        public static ProductResponse from(ProductEntity product) {
            return new ProductResponse(
                    product.getId(),
                    product.getTitle(),
                    product.getContent(),
                    product.getPrice(),
                    product.getImageUrl(),
                    product.getStock(),
                    product.getRating(),
                    product.getCategory() != null ? product.getCategory().getId() : null,
                    product.getCategory() != null ? product.getCategory().getName() : null,
                    product.getCreatedAt(),
                    product.getUpdatedAt()
            );
        }
    }
}
