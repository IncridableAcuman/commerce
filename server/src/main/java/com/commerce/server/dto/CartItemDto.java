package com.commerce.server.dto;

import lombok.Data;

@Data
public class CartItemDto {
private int quantity;
private ProductResponse product;
}
