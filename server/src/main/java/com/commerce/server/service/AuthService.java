package com.commerce.server.service;

import com.commerce.server.dto.AuthResponse;
import com.commerce.server.dto.LoginRequest;
import com.commerce.server.dto.PasswordService;
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
    private final PasswordService passwordService;

    public AuthResponse register(RegisterRequest request, HttpServletResponse response){
        userManagementService.existUser(request.getEmail());
        User user = userManagementService.create(request);
       return tokenService.saveToken(user,response);
    }
    public AuthResponse login(LoginRequest request,HttpServletResponse response)  {
        User user = userManagementService.findUser(request.getEmail());
        passwordService.matchedPassword(request.getPassword(),user.getPassword());
        return tokenService.saveToken(user,response);
    }
    public void logout(String refreshToken,HttpServletResponse response){
        User user = tokenService.tokenExtraction(refreshToken);
        tokenService.clearToken(user,response);
    }
    public AuthResponse refresh(String refreshToken,HttpServletResponse response){
        User user = tokenService.tokenExtraction(refreshToken);
        return tokenService.saveToken(user,response);
    }
    
}
