package com.commerce.backend.service;

import com.commerce.backend.dto.AuthDto;
import com.commerce.backend.entity.TokenEntity;
import com.commerce.backend.entity.UserEntity;
import com.commerce.backend.exception.CustomBadRequestException;
import com.commerce.backend.exception.CustomNotFoundException;
import com.commerce.backend.exception.CustomUnauthorizedException;
import com.commerce.backend.repository.UserRepository;
import com.commerce.backend.util.CookieUtil;
import com.commerce.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final RedisService redisService;
    private final MailService mailService;
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;
    private final PasswordEncoder passwordEncoder;
    private final EmailTemplateService emailTemplateService;

    public UserEntity findUserByEmail(String email){
        return userRepository.findByEmail(email).orElseThrow(CustomNotFoundException::new);
    }
    public AuthDto.AuthResponse authResponse(UserEntity user, HttpServletResponse response){
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);
        tokenService.saveToken(user,refreshToken);
        cookieUtil.addCookie(refreshToken,response);
        return AuthDto.AuthResponse.form(accessToken);
    }
    public AuthDto.AuthResponse login(AuthDto.LoginRequest request,HttpServletResponse response){
        UserEntity user = findUserByEmail(request.getEmail());
        if (!user.isEnabled()){
            throw new CustomBadRequestException("Account does not active. Check your email!");}
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new CustomBadRequestException("Password mismatch");}
        return authResponse(user,response);
    }
    public UserEntity validateTokenAndGetUserFromToken(String token){
        if (token == null || !token.isEmpty()){
            throw new CustomUnauthorizedException("Token is null or empty");}
        String email = jwtUtil.getSubject(token);
        UserEntity user = findUserByEmail(email);
        TokenEntity existToken = tokenService.getToken(user);
        if (!existToken.getRefreshToken().equals(token) || !jwtUtil.validateToken(token)){
            throw new CustomUnauthorizedException("Invalid or expired token");}
        return user;
    }
    public void logout(String refreshToken,HttpServletResponse response){
        UserEntity user = validateTokenAUserndGetUserFromToken(refreshToken);
        tokenService.deleteToken(user);
        cookieUtil.clearCookie(response);
    }
    public AuthDto.AuthResponse refresh(String refreshToken,HttpServletResponse response){
        UserEntity user = validateTokenAndGetUserFromToken(refreshToken);
        return authResponse(user,response);
    }
    public void forgotPassword(AuthDto.ForgotPasswordRequest request){

    }
    public void resetPassword(AuthDto.ResetPasswordRequest request){

    }
}
