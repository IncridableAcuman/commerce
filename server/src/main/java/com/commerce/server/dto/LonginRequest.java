package com.commerce.server.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LonginRequest {
    @Email
    private String email;

    @NotBlank(message = "Password must be required")
    @Size(min = 8,max = 50,message = "Password must between 3 and 50 characters long")
    private String password;
}
