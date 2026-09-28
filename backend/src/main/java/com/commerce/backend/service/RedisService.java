package com.commerce.backend.service;

import com.commerce.backend.exception.CustomBadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {
    private final RedisTemplate<String,Object> template;

    public String getKey(String email){
        if (email == null || email.isEmpty()){throw new CustomBadRequestException("Email is null or empty");}
        return "otp:" + email;
    }
    public void saveOtp(String email,String otp){
        String key = getKey(email);
        template
                .opsForValue().set(
                        key,
                        otp,
                        10,
                        TimeUnit.MINUTES
                );
    }
    public String  getOtp(String email){
        String key = getKey(email);
        Object otp = template.opsForValue().get(key);
        return otp != null ? otp.toString() : null;
    }
    public void deleteOtp(String email){
        String key = getKey(email);
        template.delete(key);
    }
}
