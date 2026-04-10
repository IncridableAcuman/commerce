package com.commerce.server.repository;

import com.commerce.server.entity.Product;
import com.commerce.server.enums.Category;
import com.commerce.server.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {
    Optional<Product> findByCategory(Category category);
    Optional<Product> findByStatus(Status status);
}
