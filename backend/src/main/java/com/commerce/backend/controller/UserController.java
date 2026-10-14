package com.commerce.backend.controller;

import com.commerce.backend.dto.UserDto;
import com.commerce.backend.exception.CustomUnauthorizedException;
import com.commerce.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserDto.UserResponse> getProfile(Authentication authentication) {
        String email = getAuthenticatedEmail(authentication);
        return ResponseEntity.ok(userService.getProfile(email));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto.UserResponse> updateProfile(
            @Valid @RequestBody UserDto.ProfileUpdateRequest request,
            Authentication authentication
    ) {
        String email = getAuthenticatedEmail(authentication);
        return ResponseEntity.ok(userService.updateProfile(email, request));
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody UserDto.ChangePasswordRequest request,
            Authentication authentication
    ) {
        String email = getAuthenticatedEmail(authentication);
        userService.changePassword(email, request);
        return ResponseEntity.ok(Map.of("message", "Parol muvaffaqiyatli yangilandi"));
    }

    @PostMapping("/avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        String email = getAuthenticatedEmail(authentication);
        String avatarUrl = userService.updateAvatar(email, file);
        return ResponseEntity.ok(Map.of("avatarUrl", avatarUrl, "message", "Avatar muvaffaqiyatli yangilandi"));
    }

    private String getAuthenticatedEmail(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new CustomUnauthorizedException("Foydalanuvchi tizimga kirmagan yoki token eskirgan");
        }
        return authentication.getName();
    }
}
