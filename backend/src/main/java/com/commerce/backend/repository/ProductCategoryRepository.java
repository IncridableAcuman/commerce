package com.commerce.backend.repository;

import com.commerce.backend.entity.ProductCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategoryEntity, Long> {
    Optional<ProductCategoryEntity> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}
