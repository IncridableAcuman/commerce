package com.commerce.backend.service;

import com.commerce.backend.exception.CustomBadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisService {
    private final RedisTemplate<String,Object> template;

    private static class OtpEntry {
        final String otp;
        final Instant expiresAt;

        OtpEntry(String otp, Instant expiresAt) {
            this.otp = otp;
            this.expiresAt = expiresAt;
        }
    }

    private final Map<String, OtpEntry> inMemoryOtpStore = new ConcurrentHashMap<>();

    public String getKey(String email){
        if (email == null || email.isEmpty()){throw new CustomBadRequestException("Email is null or empty");}
        return "otp:" + email;
    }

    public void saveOtp(String email,String otp){
        String key = getKey(email);
        try {
            template
                    .opsForValue().set(
                            key,
                            otp,
                            10,
                            TimeUnit.MINUTES
                    );
            return;
        } catch (Exception e) {
            log.warn("Redis unavailable ({}), saving OTP in memory fallback store", e.getMessage());
        }
        inMemoryOtpStore.put(key, new OtpEntry(otp, Instant.now().plusSeconds(600)));
    }

    public String getOtp(String email){
        String key = getKey(email);
        try {
            Object otp = template.opsForValue().get(key);
            if (otp != null) {
                return otp.toString();
            }
        } catch (Exception e) {
            log.warn("Redis unavailable ({}), checking in-memory OTP fallback store", e.getMessage());
        }
        OtpEntry entry = inMemoryOtpStore.get(key);
        if (entry != null) {
            if (Instant.now().isAfter(entry.expiresAt)) {
                inMemoryOtpStore.remove(key);
                return null;
            }
            return entry.otp;
        }
        return null;
    }

    public void deleteOtp(String email){
        String key = getKey(email);
        try {
            template.delete(key);
        } catch (Exception e) {
            log.warn("Redis unavailable ({}), deleting OTP from in-memory fallback store", e.getMessage());
        }
        inMemoryOtpStore.remove(key);
    }
}
