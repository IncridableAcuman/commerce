package com.commerce.server.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_item")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @OneToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private double total;

    private int quantity;
}
