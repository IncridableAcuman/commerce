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

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;

    public Cart createCart(User user){
       return cartRepository.findCartByUser(user).orElseGet(()->{
            Cart cto = new Cart();
            cto.setUser(user);
            cto.setCartItems(new ArrayList<>());
            return cartRepository.save(cto);
        });
    }
    public Cart addToCart(User user,Long productId,int quantity){
     Cart cart = createCart(user);
        Product product = productRepository.findById(productId).orElseThrow(()-> new NotFoundException("Product not found"));
        List<CartItem> cartItems = cart.getCartItems()
                .stream()
                .map(item->{
                    item.setCart(cart);
                    item.setProduct(product);
                    item.setQuantity(quantity);
                    return cartItemRepository.save(item);
                }).toList();
        cart.setCartItems(cartItems);
       return cartRepository.save(cart);
    }
    public void clearCart(User user){
        Cart cart = createCart(user);
        cartRepository.delete(cart);
    }
}
