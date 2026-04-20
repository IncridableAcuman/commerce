package com.commerce.server.dto;

import com.commerce.server.entity.User;
import com.commerce.server.enums.Role;

public record UserResponse(
        Long id,
        String firstname,
        String lastname,
        String username,
        String email,
        Role role
) {
    public static UserResponse from(User user){
        return new UserResponse(
                user.getId(),
                user.getFirstname(),
                user.getLastname(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }
}
