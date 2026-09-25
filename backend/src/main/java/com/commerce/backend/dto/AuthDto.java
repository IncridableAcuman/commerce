package com.commerce.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AuthDto {
    @Data
    public static class RegisterRequest {
        @NotBlank(message = "Full name is required")
        @Size(min = 3,max = 50,message = "Full name must be between 3 and 50 characters")
        private String fullName;

        @NotBlank(message = "Username is required")
        @Size(min = 3,max = 50,message = "Username must be between 3 and 50 characters")
        private String username;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8,max = 50,message = "Password must be between 8 and 50 characters")
        private String password;
    }
    @Data
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8,max = 50,message = "Password must be between 8 and 50 characters")
        private String password;
    }
    @Data
    public static class ForgotPasswordRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;
    }
    @Data
    public static class ResetPasswordRequest {
        @NotBlank(message = "Token is required")
        private String token;

        @NotBlank(message = "Password is required")
        @Size(min = 8,max = 50,message = "Password must be between 8 and 50 characters")
        private String password;

        @NotBlank(message = "Confirm password is required")
        @Size(min = 8,max = 50,message = "Confirm password must be between 8 and 50 characters")
        private String confirmPassword;
    }
    public record AuthResponse(String accessToken){
        public static AuthResponse form(String accessToken){
            return new AuthResponse(accessToken);
        }
    }
}
