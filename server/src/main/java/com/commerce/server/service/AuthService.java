package com.commerce.server.service;

import com.commerce.server.dto.AuthResponse;
import com.commerce.server.dto.RegisterRequest;
import com.commerce.server.entity.User;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserManagementService userManagementService;
    private final TokenService tokenService;

    public AuthResponse register(RegisterRequest request, HttpServletResponse response){
        userManagementService.existUser(request.getEmail());
        User user = userManagementService.create(request);
       return tokenService.saveToken(user,response);
    }
}
