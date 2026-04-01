package com.commerce.server.service;

import com.commerce.server.dto.*;
import com.commerce.server.dto.PasswordService;
import com.commerce.server.entity.User;
import com.commerce.server.exception.BadRequestException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserManagementService userManagementService;
    private final TokenService tokenService;
    private final MailService mailService;
    private final PasswordService passwordService;
    private final RedisService redisService;

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

        String savedToken = redisService.getToken(user);

        if (!savedToken.equals(refreshToken)){
            throw new BadRequestException("Invalid token");
        }
        return tokenService.saveToken(user,response);
    }
    public void forgotPassword(ForgotPasswordRequest request){
        User user = userManagementService.findUser(request.getEmail());
        mailService.sendMail(user);
    }
    public void resetPassword(ResetPasswordRequest request){
        User user = tokenService.tokenExtraction(request.getToken());
        passwordService.hashedPassword(request.getPassword(),user);
        userManagementService.saveUser(user);
    }
}
