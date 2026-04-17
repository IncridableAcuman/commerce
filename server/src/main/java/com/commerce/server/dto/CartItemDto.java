package com.commerce.server.dto;

import com.commerce.server.entity.Product;
import lombok.Data;

@Data
public class CartItemDto {
private int quantity;
private Product product;
private double total;
}
