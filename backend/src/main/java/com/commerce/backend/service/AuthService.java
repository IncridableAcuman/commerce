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
import org.springframework.web.client.RestClient;

import java.security.SecureRandom;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    @Value("${client.url:http://localhost:5173}")
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
        return userRepository.findByEmail(email).orElseThrow(CustomNotFoundException::new);
    }

    public AuthDto.AuthResponse authResponse(UserEntity user, HttpServletResponse response){
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);
        tokenService.saveToken(user, refreshToken);
        cookieUtil.addCookie(refreshToken, response);
        return AuthDto.AuthResponse.form(accessToken, user);
    }

    @Transactional
    public void register(AuthDto.RegisterRequest request){
        if (userRepository.existsByEmail(request.getEmail())){
            throw new CustomBadRequestException(Messages.EXIST_USER);
        }
        UserEntity user = UserEntity
                .builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .enabled(false)
                .build();
        userRepository.save(user);
        sendOtpCode(user);
    }

    public void sendOtpCode(UserEntity user){
        String otp = String.format("%06d", new SecureRandom().nextInt(1000000));
        redisService.saveOtp(user.getEmail(), otp);
        try {
            Map<String,Object> variables = Map.of("fullName", user.getFullName(), "otp", otp);
            String template = emailTemplateService.processTemplate("otp-template", variables);
            EmailPayload payload = new EmailPayload(user.getEmail(), Messages.VERIFICATION_EMAIL, template);
            mailService.sendMessageWithRabbitMq(payload);
            log.info("OTP kod yuborildi: email={}", user.getEmail());
        } catch (Exception e) {
            log.error("RabbitMQ/Mail error sending OTP to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    public void resendOtpCode(AuthDto.ResendOtpCodeRequest request){
        log.info("Qayta OTP so'rovi: email={}", request.getEmail());
        UserEntity user = findUserByEmail(request.getEmail());
        sendOtpCode(user);
    }

    @Transactional
    public AuthDto.AuthResponse verifyEmail(AuthDto.VerifyEmailRequest request, HttpServletResponse response){
        String cacheOtp = redisService.getOtp(request.getEmail());
        if (cacheOtp == null || !cacheOtp.equals(request.getOtp())){
            log.warn("Noto'g'ri yoki muddati o'tgan OTP: email={}", request.getEmail());
            throw new CustomBadRequestException(Messages.INVALID_OR_EXPIRED_OTP);
        }
        UserEntity user = findUserByEmail(request.getEmail());
        user.setEnabled(true);
        userRepository.save(user);
        redisService.deleteOtp(request.getEmail());
        log.info("Email muvaffaqiyatli tasdiqlandi: email={}", user.getEmail());
        return authResponse(user, response);
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request, HttpServletResponse response){
        UserEntity user = findUserByEmail(request.getEmail());
        if (!user.isEnabled()){
            log.warn("Faollashtirilmagan hisob orqali kirishga urinish: email={}", request.getEmail());
            throw new CustomBadRequestException(Messages.ACCOUNT_NOT_ACTIVE);
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            log.warn("Noto'g'ri parol bilan kirishga urinish: email={}", request.getEmail());
            throw new CustomBadRequestException(Messages.PASSWORD_MISMATCH);
        }
        log.info("Foydalanuvchi tizimga kirdi: email={}", user.getEmail());
        return authResponse(user, response);
    }

    public UserEntity validateTokenAndGetUserFromToken(String token){
        if (token == null || token.isBlank()){
            throw new CustomUnauthorizedException(Messages.INVALID_OR_EXPIRED_TOKEN);
        }
        if (!jwtUtil.validateToken(token)){
            throw new CustomUnauthorizedException(Messages.INVALID_OR_EXPIRED_TOKEN);
        }
        String email = jwtUtil.getSubject(token);
        UserEntity user = findUserByEmail(email);
        TokenEntity existToken = tokenService.getToken(user);
        if (!existToken.getRefreshToken().equals(token)){
            throw new CustomUnauthorizedException(Messages.INVALID_OR_EXPIRED_TOKEN);
        }
        return user;
    }

    public UserEntity validateResetTokenAndGetUser(String token){
        if (token == null || token.isBlank()){
            throw new CustomUnauthorizedException(Messages.INVALID_OR_EXPIRED_TOKEN);
        }
        if (!jwtUtil.validateToken(token)){
            throw new CustomUnauthorizedException(Messages.INVALID_OR_EXPIRED_TOKEN);
        }
        String email = jwtUtil.getSubject(token);
        return findUserByEmail(email);
    }

    public void logout(String refreshToken, HttpServletResponse response){
        UserEntity user = validateTokenAndGetUserFromToken(refreshToken);
        tokenService.deleteToken(user);
        cookieUtil.clearCookie(response);
        log.info("Foydalanuvchi tizimdan chiqdi: email={}", user.getEmail());
    }

    public AuthDto.AuthResponse refresh(String refreshToken, HttpServletResponse response){
        UserEntity user = validateTokenAndGetUserFromToken(refreshToken);
        log.debug("Token yangilandi: email={}", user.getEmail());
        return authResponse(user, response);
    }

    public void forgotPassword(AuthDto.ForgotPasswordRequest request){
        UserEntity user = findUserByEmail(request.getEmail());
        String token = jwtUtil.generateAccessToken(user);
        String url = clientUrl + "/reset-password?token=" + token;
        try {
            Map<String,Object> variables = Map.of("resetUrl", url);
            String template = emailTemplateService.processTemplate("reset-password-template", variables);
            EmailPayload payload = new EmailPayload(user.getEmail(), Messages.RESET_PASSWORD, template);
            mailService.sendMessageWithRabbitMq(payload);
        } catch (Exception e) {
            System.err.println("RabbitMQ/Mail error sending reset password link: " + e.getMessage());
        }
    }

    @Transactional
    public void resetPassword(AuthDto.ResetPasswordRequest request){
        if (!request.getPassword().equals(request.getConfirmPassword())){
            throw new CustomBadRequestException(Messages.PASSWORD_MISMATCH);
        }
        UserEntity user = validateResetTokenAndGetUser(request.getToken());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        tokenService.deleteToken(user);
    }

    public AuthDto.UserResponse getCurrentUser(String email){
        UserEntity user = findUserByEmail(email);
        return AuthDto.UserResponse.from(user);
    }

    @Transactional
    public AuthDto.AuthResponse processGoogleLogin(String email, String name, String picture, HttpServletResponse response){
        UserEntity user = userRepository.findByEmail(email).orElseGet(() -> {
            String baseUsername = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "");
            if (baseUsername.isBlank()) baseUsername = "user";
            return UserEntity.builder()
                    .email(email)
                    .fullName(name != null && !name.isBlank() ? name : baseUsername)
                    .username(baseUsername + "_" + (new SecureRandom().nextInt(9000) + 1000))
                    .avatar(picture)
                    .role(Role.USER)
                    .enabled(true)
                    .build();
        });

        if (picture != null && (user.getAvatar() == null || user.getAvatar().isBlank())) {
            user.setAvatar(picture);
        }
        user.setEnabled(true);
        user = userRepository.save(user);

        return authResponse(user, response);
    }

    public AuthDto.AuthResponse loginWithGoogleToken(AuthDto.GoogleAuthRequest request, HttpServletResponse response){
        try {
            RestClient restClient = RestClient.create();
            // Google userinfo or tokeninfo endpoint
            @SuppressWarnings("unchecked")
            Map<String, Object> googleUser = restClient.get()
                    .uri("https://oauth2.googleapis.com/tokeninfo?id_token=" + request.getToken())
                    .retrieve()
                    .body(Map.class);

            if (googleUser == null || googleUser.get("email") == null) {
                // Try userinfo with token as access_token
                googleUser = restClient.get()
                        .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                        .header("Authorization", "Bearer " + request.getToken())
                        .retrieve()
                        .body(Map.class);
            }

            if (googleUser == null || googleUser.get("email") == null) {
                throw new CustomBadRequestException("Google autentifikatsiyasi muvaffaqiyatsiz bo'ldi");
            }

            String email = (String) googleUser.get("email");
            String name = (String) googleUser.get("name");
            String picture = (String) googleUser.get("picture");

            return processGoogleLogin(email, name, picture, response);
        } catch (Exception e) {
            throw new CustomBadRequestException("Google token yaroqsiz: " + e.getMessage());
        }
    }
}

