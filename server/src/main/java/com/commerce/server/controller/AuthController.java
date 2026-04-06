package com.commerce.server.controller;

import com.commerce.server.dto.*;
import com.commerce.server.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String > register(@Valid @RequestBody RegisterRequest request){
        authService.register(request);
        return ResponseEntity.ok("Verification link sent to email");
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request,HttpServletResponse response) {
        return ResponseEntity.ok(authService.login(request,response));
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@CookieValue(name = "refreshToken",required = false) String refreshToken,HttpServletResponse response){
        authService.logout(refreshToken,response);
        return ResponseEntity.ok("User logged out");
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request){
        authService.forgotPassword(request);
        return ResponseEntity.ok("Reset password link sent to email");
    }
    @GetMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@CookieValue(name = "refreshToken",required = false) String refreshToken,HttpServletResponse response){
        return ResponseEntity.ok(authService.refresh(refreshToken,response));
    }
    @PutMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request){
        authService.resetPassword(request);
        return ResponseEntity.ok("Password updated successfully");
    }
    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token){
        authService.verifyEmail(token);
        return ResponseEntity.ok("Email verified successfully");
    }
}
