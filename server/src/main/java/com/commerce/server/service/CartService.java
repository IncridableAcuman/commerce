package com.commerce.server.service;

import com.commerce.server.entity.Cart;
import com.commerce.server.entity.CartItem;
import com.commerce.server.entity.Product;
import com.commerce.server.entity.User;
import com.commerce.server.exception.NotFoundException;
import com.commerce.server.repository.CartItemRepository;
import com.commerce.server.repository.CartRepository;
import com.commerce.server.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;

    @Transactional
    public Cart createCart(User user){
       return cartRepository.findCartByUser(user).orElseGet(()->{
            Cart cto = new Cart();
            cto.setUser(user);
            cto.setCartItems(new ArrayList<>());
            return cartRepository.save(cto);
        });
    }
    @Transactional
    public Cart addToCart(User user,Long productId,int quantity){
        Cart cart = createCart(user);
        Product product = productRepository.findById(productId).orElseThrow(()-> new NotFoundException("Product not found"));

        Optional<CartItem> existingCartItem = cart.getCartItems().stream()
                .filter(ci-> Objects.equals(ci.getProduct().getId(), productId)).findFirst();
        if (existingCartItem.isPresent()){
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(quantity+cartItem.getQuantity());
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
            cart.getCartItems().add(item);
        }
        return cart;
    }

    @Transactional
    public Cart removeFromCart(User user,Long itemId){
        Cart cart = createCart(user);
        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> Objects.equals(item.getId(),itemId))
                .findFirst()
                .orElseThrow(()-> new NotFoundException("Item not found"));
        cart.getCartItems().remove(cartItem);
        return cart;
    }
}
