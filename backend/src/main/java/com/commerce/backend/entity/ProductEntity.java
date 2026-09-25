package com.commerce.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter @Builder
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title",nullable = false)
    private String title;

    @Column(name = "content",nullable = false)
    private String content;

    @Column(name = "price",nullable = false)
    private double price;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PostPersist
    public void productPersist(){
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    @PostUpdate
    public void productUpdate(){
        updatedAt = LocalDateTime.now();
    }
}
