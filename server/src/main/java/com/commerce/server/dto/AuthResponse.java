package com.commerce.server.dto;

import com.commerce.server.entity.User;
import com.commerce.server.enums.Role;

public record AuthResponse(
        Long id,
        String email,
        Role role,
        String accessToken
) {
    public static AuthResponse from(User user,String accessToken){
        return new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                accessToken
        );
    }
}
