package com.commerce.server.dto;

import com.commerce.server.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordService {
    private final PasswordEncoder passwordEncoder;

    public void matchedPassword(String rawPassword,String encodePassword) {
        if (!passwordEncoder.matches(rawPassword,encodePassword)){
            throw new BadRequestException("Password is not equal");
        }
    }
}
