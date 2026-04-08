package com.commerce.server.dto;

import com.commerce.server.enums.Category;
import com.commerce.server.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProductRequest {
    private String title;

    private String description;

    @NotNull(message = "Price must be required")
    private double price;

    private Category category;

    private com.commerce.server.enums.Size size;

    private MultipartFile image;

    private Status status;
}
