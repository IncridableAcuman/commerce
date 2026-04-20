package com.commerce.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank(message = "Token must be required")
    private String token;

    @NotBlank(message = "Password must be required")
    @Size(min = 8,max = 50,message = "Password must between 3 and 50 characters long")
    private String password;
}
