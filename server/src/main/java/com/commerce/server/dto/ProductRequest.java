package com.commerce.server.dto;

import com.commerce.server.enums.Category;
import com.commerce.server.enums.Status;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProductRequest {
    private String title;

    private String description;

    private double price;

    private Category category;

    private com.commerce.server.enums.Size size;

    private MultipartFile image;

    private Status status;
}
