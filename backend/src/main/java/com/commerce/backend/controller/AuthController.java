package com.commerce.backend.controller;

import com.commerce.backend.constants.Messages;
import com.commerce.backend.dto.AuthDto;
import com.commerce.backend.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> sendOtpCode(@Valid @RequestBody AuthDto.RegisterRequest request){
        authService.register(request);
        return ResponseEntity.ok(Messages.COMPLETE_REGISTRATION);
    }
    @PostMapping("/verify-email")
    public ResponseEntity<AuthDto.AuthResponse> verifyEmail(@Valid @RequestBody AuthDto.VerifyEmailRequest request,HttpServletResponse response){
        return ResponseEntity.ok(authService.verifyEmail(request,response));
    }
    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@Valid @RequestBody AuthDto.ResendOtpCodeRequest request){
        authService.resendOtpCode(request);
        return ResponseEntity.ok(Messages.RESEND_OTP);
    }
    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(@Valid @RequestBody AuthDto.LoginRequest request, HttpServletResponse response){
        return ResponseEntity.ok(authService.login(request, response));
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@CookieValue(name = Messages.REFRESH_TOKEN,required = false) String refreshToken,HttpServletResponse response){
        authService.logout(refreshToken, response);
        return ResponseEntity.ok(Messages.LOGGED_OUT);
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody AuthDto.ForgotPasswordRequest request){
        authService.forgotPassword(request);
        return ResponseEntity.ok(Messages.RESET_PASSWORD_LINK);
    }
    @GetMapping("/refresh")
    public ResponseEntity<AuthDto.AuthResponse> refresh(@CookieValue(name = Messages.REFRESH_TOKEN,required = false) String refreshToken,HttpServletResponse response){
        return ResponseEntity.ok(authService.refresh(refreshToken, response));
    }
    @PutMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody AuthDto.ResetPasswordRequest request){
        authService.resetPassword(request);
        return ResponseEntity.ok(Messages.UPDATE_PASSWORD);
    }
}
