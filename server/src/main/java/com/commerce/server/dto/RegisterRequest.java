package com.commerce.server.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Firstname must be required")
    @Size(min = 3,max = 50,message = "Firstname must between 3 and 50 characters long")
    private String firstname;

    @NotBlank(message = "Lastname must be required")
    @Size(min = 3,max = 50,message = "Lastname must between 3 and 50 characters long")
    private String lastname;

    @NotBlank(message = "Username must be required")
    @Size(min = 3,max = 50,message = "Firstname must between 3 and 50 characters long")
    private String username;

    @Email
    private String email;

    @NotBlank(message = "Password must be required")
    @Size(min = 8,max = 50,message = "Password must between 3 and 50 characters long")
    private String password;
}
