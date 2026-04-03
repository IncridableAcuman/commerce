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
    @NotBlank(message = "Title must be required")
    @Size(min = 5,max = 100,message = "Title must between 5 and 100 characters long")
    private String title;

    @NotBlank(message = "Description must be required")
    @Size(min = 10,max = 255,message = "Description must between 10 and 255 characters long")
    private String description;

    @NotNull(message = "Price must be required")
    private double price;

    @NotBlank(message = "Category must be required")
    private Category category;

    @NotBlank(message = "Size must be required")
    private com.commerce.server.enums.Size size;

    @NotBlank(message = "Image must be required")
    private MultipartFile image;

    @NotBlank(message = "Status must be required")
    private Status status;
}
