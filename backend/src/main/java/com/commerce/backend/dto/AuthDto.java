package com.commerce.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AuthDto {

    @Data
    public static class RegisterRequest {
        @NotBlank(message = "To'liq ism kiritilishi shart")
        @Size(min = 3, max = 50, message = "To'liq ism 3 dan 50 ta belgigacha bo'lishi kerak")
        private String fullName;

        @NotBlank(message = "Foydalanuvchi nomi kiritilishi shart")
        @Size(min = 3, max = 50, message = "Foydalanuvchi nomi 3 dan 50 ta belgigacha bo'lishi kerak")
        private String username;

        @NotBlank(message = "Elektron pochta kiritilishi shart")
        @Email(message = "Noto'g'ri elektron pochta formati")
        private String email;

        @NotBlank(message = "Parol kiritilishi shart")
        @Size(min = 8, max = 50, message = "Parol 8 dan 50 ta belgigacha bo'lishi kerak")
        private String password;
    }

    @Data
    public static class LoginRequest {
        @NotBlank(message = "Elektron pochta kiritilishi shart")
        @Email(message = "Noto'g'ri elektron pochta formati")
        private String email;

        @NotBlank(message = "Parol kiritilishi shart")
        @Size(min = 8, max = 50, message = "Parol 8 dan 50 ta belgigacha bo'lishi kerak")
        private String password;
    }

    @Data
    public static class ForgotPasswordRequest {
        @NotBlank(message = "Elektron pochta kiritilishi shart")
        @Email(message = "Noto'g'ri elektron pochta formati")
        private String email;
    }

    @Data
    public static class ResetPasswordRequest {
        @NotBlank(message = "Token kiritilishi shart")
        private String token;

        @NotBlank(message = "Parol kiritilishi shart")
        @Size(min = 8, max = 50, message = "Parol 8 dan 50 ta belgigacha bo'lishi kerak")
        private String password;

        @NotBlank(message = "Parolni tasdiqlash kiritilishi shart")
        @Size(min = 8, max = 50, message = "Tasdiqlash paroli 8 dan 50 ta belgigacha bo'lishi kerak")
        private String confirmPassword;
    }

    @Data
    public static class ResendOtpCodeRequest {
        @NotBlank(message = "Elektron pochta kiritilishi shart")
        @Email(message = "Noto'g'ri elektron pochta formati")
        private String email;
    }

    @Data
    public static class VerifyEmailRequest {
        @NotBlank(message = "Elektron pochta kiritilishi shart")
        @Email(message = "Noto'g'ri elektron pochta formati")
        private String email;

        @NotBlank(message = "Tasdiqlash kodi (OTP) kiritilishi shart")
        private String otp;
    }

    @Data
    public static class GoogleAuthRequest {
        @NotBlank(message = "Token bo'sh bo'lishi mumkin emas")
        private String token;
    }

    public record UserResponse(
            Long id,
            String fullName,
            String username,
            String email,
            String role,
            String avatar,
            boolean enabled
    ) {
        public static UserResponse from(com.commerce.backend.entity.UserEntity user) {
            if (user == null) return null;
            return new UserResponse(
                    user.getId(),
                    user.getFullName(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole() != null ? user.getRole().name() : null,
                    user.getAvatar(),
                    user.isEnabled()
            );
        }
    }

    public record AuthResponse(String accessToken, UserResponse user) {
        public static AuthResponse form(String accessToken, com.commerce.backend.entity.UserEntity user) {
            return new AuthResponse(accessToken, UserResponse.from(user));
        }

        public static AuthResponse form(String accessToken) {
            return new AuthResponse(accessToken, null);
        }
    }
}