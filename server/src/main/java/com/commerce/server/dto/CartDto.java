package com.commerce.server.dto;

import com.commerce.server.entity.User;
import lombok.Data;

import java.util.List;

@Data
public class CartDto {
    private Long id;
    private User user;
    private List<CartItemDto> cartItemDtoList;
}
