package com.commerce.server.service;

import com.commerce.server.dto.AuthResponse;
import com.commerce.server.entity.User;
import com.commerce.server.util.CookieUtil;
import com.commerce.server.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final CookieUtil cookieUtil;
    private final RedisService redisService;
    private final JwtUtil jwtUtil;

    public AuthResponse saveToken(User user, HttpServletResponse response){
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);
        cookieUtil.addCookie(refreshToken,response);
        redisService.saveToken(user,refreshToken);
        return AuthResponse.from(user,accessToken);
    }
    public void clearToken(User user,HttpServletResponse response){
        cookieUtil.clearCookie(response);
        redisService.deleteToken(user);
    }
}
