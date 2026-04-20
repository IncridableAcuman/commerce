package com.commerce.server.service;

import com.commerce.server.entity.User;
import com.commerce.server.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {
    @Value("${jwt.refresh_time}")
    private int refreshTime;

    private final RedisTemplate<String,Object> template;

    public String getKey(User user){
        return "refreshToken:"+user.getId();
    }

    public void saveToken(User user,String refreshToken){
        if (refreshToken == null || user == null || refreshToken.isEmpty()){
            throw new BadRequestException("Refresh token or user is null or empty");
        }
        String key = getKey(user);
        template
                .opsForValue()
                .set(
                        key,
                        refreshToken,
                        refreshTime,
                        TimeUnit.MILLISECONDS
                );
    }
    public String getToken(User user){
        if (user == null) return null;
        String key = getKey(user);
        Object token = template.opsForValue().get(key);
        return token != null ? token.toString() : null;
    }
    public void deleteToken(User user){
        String key = getKey(user);
        template.delete(key);
    }
}
