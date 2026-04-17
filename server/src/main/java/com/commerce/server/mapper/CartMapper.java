package com.commerce.server.mapper;

import com.commerce.server.dto.CartDto;
import com.commerce.server.dto.CartItemDto;
import com.commerce.server.entity.Cart;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartMapper {

    public CartDto cartDto(Cart cart){
        CartDto cartDto = new CartDto();
        cartDto.setId(cart.getId());
        cartDto.setUserId(cart.getUser().getId());
        List<CartItemDto> cartItemDtoList = cart
                .getCartItems()
                .stream()
                .map(item -> {
                    CartItemDto dto = new CartItemDto();
                    dto.setProduct(item.getProduct());
                    dto.setQuantity(item.getQuantity());
                    dto.setTotal(item.getTotal());
                    return dto;
                }).toList();
        cartDto.setCartItemDtoList(cartItemDtoList);
        return cartDto;
    }
}
