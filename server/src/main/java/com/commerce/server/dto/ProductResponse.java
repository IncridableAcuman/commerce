package com.commerce.server.dto;

import com.commerce.server.entity.Product;
import com.commerce.server.enums.Category;
import com.commerce.server.enums.Size;
import com.commerce.server.enums.Status;

public record ProductResponse(
        Long id,
        String title,
        String description,
        double price,
        Category category,
        Size size,
        String image,
        Status status
) {
    public static ProductResponse from(Product product){
        return new ProductResponse(
                product.getId(),
                product.getTitle(),
                product.getDescription(),
                product.getPrice(),
                product.getCategory(),
                product.getSize(),
                product.getImage(),
                product.getStatus()
        );
    }
}
