package com.commerce.server.service;

import com.commerce.server.util.CookieUtil;
import com.commerce.server.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final CookieUtil cookieUtil;
    private final RedisService redisService;
    private final JwtUtil jwtUtil;
}
