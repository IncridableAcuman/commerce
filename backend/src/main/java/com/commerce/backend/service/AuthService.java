package com.commerce.backend.service;

import com.commerce.backend.constants.Messages;
import com.commerce.backend.dto.AuthDto;
import com.commerce.backend.dto.EmailPayload;
import com.commerce.backend.entity.TokenEntity;
import com.commerce.backend.entity.UserEntity;
import com.commerce.backend.entity.enums.Role;
import com.commerce.backend.exception.CustomBadRequestException;
import com.commerce.backend.exception.CustomNotFoundException;
import com.commerce.backend.exception.CustomUnauthorizedException;
import com.commerce.backend.repository.UserRepository;
import com.commerce.backend.util.CookieUtil;
import com.commerce.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {
    @Value("${client.url}")
    private String clientUrl;

    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final RedisService redisService;
    private final MailService mailService;
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;
    private final PasswordEncoder passwordEncoder;
    private final EmailTemplateService emailTemplateService;

    public UserEntity findUserByEmail(String email){
        return userRepository.findByEmail(email).orElseThrow(CustomNotFoundException::new);}

    public AuthDto.AuthResponse authResponse(UserEntity user, HttpServletResponse response){
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);
        tokenService.saveToken(user,refreshToken);
        cookieUtil.addCookie(refreshToken,response);
        return AuthDto.AuthResponse.form(accessToken);
    }
    @Transactional
    public void register(AuthDto.RegisterRequest request){
        if (userRepository.existsByEmail(request.getEmail())){throw new CustomBadRequestException(Messages.EXIST_USER);}
        UserEntity user = UserEntity
                .builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        userRepository.save(user);
        sendOtpCode(user);
    }
    public void sendOtpCode(UserEntity user){
        String otp = String.format("%4d",new Random().nextInt(100000));
        Map<String,Object> variables = Map.of("fullName",user.getFullName(),"otp",otp);
        String template = emailTemplateService.processTemplate("otp-template",variables);
        EmailPayload payload = new EmailPayload(user.getEmail(),Messages.VERIFICATION_EMAIL,template);
        mailService.sendMessageWithRabbitMq(payload);
    }
    public void resendOtpCode(AuthDto.ResendOtpCodeRequest request){
        UserEntity user = findUserByEmail(request.getEmail());
        sendOtpCode(user);
    }
    public AuthDto.AuthResponse verifyEmail(AuthDto.VerifyEmailRequest request,HttpServletResponse response){
        String cacheOtp = redisService.getOtp(request.getEmail());
        if (cacheOtp == null || !cacheOtp.equals(request.getOtp())){throw new CustomBadRequestException(Messages.INVALID_OR_EXPIRED_OTP);}
        UserEntity user = findUserByEmail(request.getEmail());
        return authResponse(user,response);
    }
    public AuthDto.AuthResponse login(AuthDto.LoginRequest request,HttpServletResponse response){
        UserEntity user = findUserByEmail(request.getEmail());
        if (!user.isEnabled()){throw new CustomBadRequestException(Messages.ACCOUNT_NOT_ACTIVE);}
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())){throw new CustomBadRequestException(Messages.PASSWORD_MISMATCH);}
        return authResponse(user,response);
    }
    public UserEntity validateTokenAndGetUserFromToken(String token){
        if (token == null || !token.isEmpty()){throw new CustomUnauthorizedException(Messages.INVALID_OR_EXPIRED_TOKEN);}
        String email = jwtUtil.getSubject(token);
        UserEntity user = findUserByEmail(email);
        TokenEntity existToken = tokenService.getToken(user);
        if (!existToken.getRefreshToken().equals(token) || !jwtUtil.validateToken(token)){throw new CustomUnauthorizedException(Messages.INVALID_OR_EXPIRED_TOKEN);}
        return user;
    }
    public void logout(String refreshToken,HttpServletResponse response){
        UserEntity user = validateTokenAndGetUserFromToken(refreshToken);
        tokenService.deleteToken(user);
        cookieUtil.clearCookie(response);
    }
    public AuthDto.AuthResponse refresh(String refreshToken,HttpServletResponse response){
        UserEntity user = validateTokenAndGetUserFromToken(refreshToken);
        return authResponse(user,response);
    }
    public void forgotPassword(AuthDto.ForgotPasswordRequest request){
        UserEntity user = findUserByEmail(request.getEmail());
        String token = jwtUtil.generateAccessToken(user);
        String url = clientUrl + "/reset-password?token=" + token;
        Map<String,Object> variables = Map.of("resetUrl",url);
        String template = emailTemplateService.processTemplate("reset-password-template",variables);
        EmailPayload payload = new EmailPayload(user.getEmail(), Messages.RESET_PASSWORD,template);
        mailService.sendMessageWithRabbitMq(payload);
    }
    @Transactional
    public void resetPassword(AuthDto.ResetPasswordRequest request){
        if (!request.getPassword().equals(request.getConfirmPassword())){throw new CustomBadRequestException(Messages.PASSWORD_MISMATCH);}
        UserEntity user = validateTokenAndGetUserFromToken(request.getToken());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
    }
}
