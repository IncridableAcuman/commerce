package com.commerce.server.controller;

import com.commerce.server.dto.CartDto;
import com.commerce.server.entity.Cart;
import com.commerce.server.entity.User;
import com.commerce.server.mapper.CartMapper;
import com.commerce.server.service.CartService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    private final CartMapper cartMapper;

    @GetMapping
    public ResponseEntity<CartDto> createCart(@AuthenticationPrincipal User user){
        Cart cart = cartService.createCart(user);
        return ResponseEntity.ok(cartMapper.cartDto(cart));
    }

    @PostMapping
    public ResponseEntity<CartDto> addToCart(@AuthenticationPrincipal User user, @RequestParam Long productId,@RequestParam int quantity){
        Cart cart = cartService.addToCart(user,productId,quantity);
        return ResponseEntity.ok(cartMapper.cartDto(cart));
    }

    @DeleteMapping
    public ResponseEntity<CartDto> removeFromCart(@AuthenticationPrincipal User user,@RequestParam Long productId){
        Cart cart = cartService.removeFromCart(user,productId);
        return ResponseEntity.ok(cartMapper.cartDto(cart));
    }
}
