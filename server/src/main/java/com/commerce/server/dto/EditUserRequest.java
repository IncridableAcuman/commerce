package com.commerce.server.dto;

import com.commerce.server.enums.Role;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class EditUserRequest {
    private String firstname;
    private String lastname;
    private String username;
    @Email
    private String email;
    private String password;
    private Role role;
}
