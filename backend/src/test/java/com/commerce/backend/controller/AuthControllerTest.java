package com.commerce.backend.controller;

import com.commerce.backend.dto.AuthDto;
import com.commerce.backend.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @Test
    @DisplayName("POST /auth/register - Muvaffaqiyatli ro'yxatdan o'tish")
    void testRegisterEndpoint() throws Exception {
        AuthDto.RegisterRequest request = new AuthDto.RegisterRequest();
        request.setFullName("Alisher Navoiy");
        request.setUsername("alisher");
        request.setEmail("alisher@example.com");
        request.setPassword("securePassword123");

        doNothing().when(authService).register(any(AuthDto.RegisterRequest.class));

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /auth/login - Muvaffaqiyatli kirish")
    void testLoginEndpoint() throws Exception {
        AuthDto.LoginRequest request = new AuthDto.LoginRequest();
        request.setEmail("alisher@example.com");
        request.setPassword("securePassword123");

        when(authService.login(any(AuthDto.LoginRequest.class), any()))
                .thenReturn(AuthDto.AuthResponse.form("mock_jwt_access_token"));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("mock_jwt_access_token"));
    }

    @Test
    @DisplayName("POST /auth/verify-email - Muvaffaqiyatli tasdiqlash")
    void testVerifyEmailEndpoint() throws Exception {
        AuthDto.VerifyEmailRequest request = new AuthDto.VerifyEmailRequest();
        request.setEmail("alisher@example.com");
        request.setOtp("123456");

        when(authService.verifyEmail(any(AuthDto.VerifyEmailRequest.class), any()))
                .thenReturn(AuthDto.AuthResponse.form("mock_jwt_access_token"));

        mockMvc.perform(post("/auth/verify-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("mock_jwt_access_token"));
    }

    @Test
    @DisplayName("POST /auth/resend-otp - Yangi OTP yuborish")
    void testResendOtpEndpoint() throws Exception {
        AuthDto.ResendOtpCodeRequest request = new AuthDto.ResendOtpCodeRequest();
        request.setEmail("alisher@example.com");

        doNothing().when(authService).resendOtpCode(any(AuthDto.ResendOtpCodeRequest.class));

        mockMvc.perform(post("/auth/resend-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /auth/forgot-password - Parolni tiklash havolasi")
    void testForgotPasswordEndpoint() throws Exception {
        AuthDto.ForgotPasswordRequest request = new AuthDto.ForgotPasswordRequest();
        request.setEmail("alisher@example.com");

        doNothing().when(authService).forgotPassword(any(AuthDto.ForgotPasswordRequest.class));

        mockMvc.perform(post("/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("PUT /auth/reset-password - Parolni yangilash")
    void testResetPasswordEndpoint() throws Exception {
        AuthDto.ResetPasswordRequest request = new AuthDto.ResetPasswordRequest();
        request.setToken("reset_token_123");
        request.setPassword("newSecurePass123");
        request.setConfirmPassword("newSecurePass123");

        doNothing().when(authService).resetPassword(any(AuthDto.ResetPasswordRequest.class));

        mockMvc.perform(put("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /auth/me - Joriy foydalanuvchini olish (Avtorizatsiyadan o'tgan)")
    @WithMockUser(username = "alisher@example.com", roles = "USER")
    void testGetMeEndpoint() throws Exception {
        AuthDto.UserResponse userResponse = new AuthDto.UserResponse(
                1L,
                "Alisher Navoiy",
                "alisher",
                "alisher@example.com",
                "USER",
                null,
                true
        );

        when(authService.getCurrentUser("alisher@example.com")).thenReturn(userResponse);

        mockMvc.perform(get("/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("alisher@example.com"))
                .andExpect(jsonPath("$.fullName").value("Alisher Navoiy"));
    }

    @Test
    @DisplayName("POST /auth/google - Google OAuth2 token bilan login qilish")
    void testGoogleLoginEndpoint() throws Exception {
        AuthDto.GoogleAuthRequest request = new AuthDto.GoogleAuthRequest();
        request.setToken("mock_google_token");

        when(authService.loginWithGoogleToken(any(AuthDto.GoogleAuthRequest.class), any()))
                .thenReturn(AuthDto.AuthResponse.form("google_jwt_access_token"));

        mockMvc.perform(post("/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("google_jwt_access_token"));
    }
}
