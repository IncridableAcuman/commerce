package com.commerce.backend.dto;

import com.commerce.backend.entity.ProductCategoryEntity;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class ProductCategoryDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryRequest {
        @NotBlank(message = "Category name is required")
        private String name;

        private String description;
    }

    public record CategoryResponse(
            Long id,
            String name,
            String description,
            int productCount,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        public static CategoryResponse from(ProductCategoryEntity category) {
            return new CategoryResponse(
                    category.getId(),
                    category.getName(),
                    category.getDescription(),
                    category.getProducts() != null ? category.getProducts().size() : 0,
                    category.getCreatedAt(),
                    category.getUpdatedAt()
            );
        }
    }
}
