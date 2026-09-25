package com.commerce.backend.service;

import com.commerce.backend.entity.TokenEntity;
import com.commerce.backend.entity.UserEntity;
import com.commerce.backend.exception.CustomNotFoundException;
import com.commerce.backend.repository.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final TokenRepository tokenRepository;

    @Transactional
    public void saveToken(UserEntity user,String refreshToken){
        TokenEntity token = tokenRepository.findByUser(user).orElseGet(TokenEntity::new);
        token.setUser(user);
        token.setRefreshToken(refreshToken);
        token.setExpiration(LocalDateTime.now().plusDays(7));
        tokenRepository.save(token);
    }
    public TokenEntity getToken(UserEntity user){
        return tokenRepository.findByUser(user).orElseThrow(CustomNotFoundException::new);
    }
    public void deleteToken(UserEntity user){
        tokenRepository.findByUser(user).ifPresent(tokenRepository::delete);
    }
}
