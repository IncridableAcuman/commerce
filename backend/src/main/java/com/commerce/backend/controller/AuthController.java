package com.commerce.backend.controller;

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

    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(@Valid @RequestBody AuthDto.LoginRequest request, HttpServletResponse response){
        return ResponseEntity.ok(authService.login(request, response));
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@CookieValue(name = "refreshToken",required = false) String refreshToken,HttpServletResponse response){
        authService.logout(refreshToken, response);
        return ResponseEntity.ok("Logged out");
    }
    @GetMapping("/refresh")
    public ResponseEntity<AuthDto.AuthResponse> refresh(@CookieValue(name = "refreshToken",required = false) String refreshToken,HttpServletResponse response){
        return ResponseEntity.ok(authService.refresh(refreshToken, response));
    }
}
