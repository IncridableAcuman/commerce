package com.commerce.server.dto;

import lombok.Data;

import java.util.List;

@Data
public class CartDto {
    private Long id;
    private Long userId;
    private List<CartItemDto> cartItemDtoList;
}
