package com.commerce.backend.repository;

import com.commerce.backend.entity.TokenEntity;
import com.commerce.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface TokenRepository extends JpaRepository<TokenEntity,Long> {
    Optional<TokenEntity> findByUser(UserEntity user);
}
