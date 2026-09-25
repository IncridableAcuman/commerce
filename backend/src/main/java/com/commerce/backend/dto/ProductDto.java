package com.commerce.backend.dto;

import com.commerce.backend.entity.ProductEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProductDto {

    @Data
    public static class ProductRequest{
        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Content is required")
        private String content;

        @NotNull(message = "Price is required")
        private double price;
    }
    public record ProductResponse(
            Long id,
            String title,
            String content,
            double price,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ){
        public static ProductResponse from(ProductEntity product){
            return new ProductResponse(
                    product.getId(),
                    product.getTitle(),
                    product.getContent(),
                    product.getPrice(),
                    product.getCreatedAt(),
                    product.getUpdatedAt()
            );
        }
    }
}
