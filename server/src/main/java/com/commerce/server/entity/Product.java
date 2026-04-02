package com.commerce.server.entity;

import com.commerce.server.enums.Category;
import com.commerce.server.enums.Size;
import com.commerce.server.enums.Status;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title",nullable = false)
    private String title;

    @Column(name = "description",nullable = false)
    private String description;

    @Column(name = "price",nullable = false)
    private double price;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Enumerated(EnumType.STRING)
    private Size size;

    private String image;

    @Enumerated(EnumType.STRING)
    private Status status;

}
