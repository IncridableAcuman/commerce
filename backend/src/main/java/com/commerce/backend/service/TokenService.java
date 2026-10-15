package com.commerce.backend.service;

import com.commerce.backend.constants.Messages;
import com.commerce.backend.entity.TokenEntity;
import com.commerce.backend.entity.UserEntity;
import com.commerce.backend.exception.CustomUnauthorizedException;
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
        TokenEntity token = tokenRepository.findByUser(user)
                .orElseThrow(() -> new CustomUnauthorizedException(Messages.INVALID_OR_EXPIRED_TOKEN));
        if (token.getExpiration() != null && token.getExpiration().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(token);
            throw new CustomUnauthorizedException(Messages.INVALID_OR_EXPIRED_TOKEN);
        }
        return token;
    }

    @Transactional
    public void deleteToken(UserEntity user){
        tokenRepository.findByUser(user).ifPresent(tokenRepository::delete);
    }
}

