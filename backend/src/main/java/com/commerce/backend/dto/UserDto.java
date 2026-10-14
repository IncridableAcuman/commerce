package com.commerce.backend.dto;

import com.commerce.backend.entity.UserEntity;
import com.commerce.backend.entity.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class UserDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserResponse {
        private Long id;
        private String fullName;
        private String username;
        private String email;
        private Role role;
        private String avatar;
        private String phoneNumber;
        private String address;
        private boolean enabled;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static UserResponse from(UserEntity user) {
            return UserResponse.builder()
                    .id(user.getId())
                    .fullName(user.getFullName())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .avatar(user.getAvatar())
                    .phoneNumber(user.getPhoneNumber())
                    .address(user.getAddress())
                    .enabled(user.isEnabled())
                    .createdAt(user.getCreatedAt())
                    .updatedAt(user.getUpdatedAt())
                    .build();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProfileUpdateRequest {
        @NotBlank(message = "To'liq ism kiritilishi shart")
        @Size(min = 2, max = 100, message = "To'liq ism 2 dan 100 ta belgigacha bo'lishi kerak")
        private String fullName;

        @NotBlank(message = "Foydalanuvchi nomi kiritilishi shart")
        @Size(min = 3, max = 50, message = "Foydalanuvchi nomi 3 dan 50 ta belgigacha bo'lishi kerak")
        private String username;

        private String phoneNumber;
        private String address;
        private String avatar;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChangePasswordRequest {
        @NotBlank(message = "Joriy parol kiritilishi shart")
        private String currentPassword;

        @NotBlank(message = "Yangi parol kiritilishi shart")
        @Size(min = 6, max = 50, message = "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak")
        private String newPassword;

        @NotBlank(message = "Yangi parolni tasdiqlash kiritilishi shart")
        private String confirmPassword;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRoleRequest {
        @NotNull(message = "Rol kiritilishi shart")
        private Role role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateUserStatusRequest {
        @NotNull(message = "Holat kiritilishi shart")
        private Boolean enabled;
    }
}
