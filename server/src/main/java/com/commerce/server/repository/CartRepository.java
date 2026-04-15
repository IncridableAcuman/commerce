package com.commerce.server.repository;

import com.commerce.server.entity.Cart;
import com.commerce.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart,Long> {
    Optional<Cart> findCartByUser(User user);
}
