package com.commerce.backend.service;

import com.commerce.backend.dto.AuthDto;
import com.commerce.backend.entity.TokenEntity;
import com.commerce.backend.entity.UserEntity;
import com.commerce.backend.entity.enums.Role;
import com.commerce.backend.exception.CustomBadRequestException;
import com.commerce.backend.exception.CustomUnauthorizedException;
import com.commerce.backend.repository.UserRepository;
import com.commerce.backend.util.CookieUtil;
import com.commerce.backend.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenService tokenService;

    @Mock
    private RedisService redisService;

    @Mock
    private MailService mailService;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private CookieUtil cookieUtil;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailTemplateService emailTemplateService;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private AuthService authService;

    private UserEntity testUser;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "clientUrl", "http://localhost:5173");
        testUser = UserEntity.builder()
                .id(1L)
                .fullName("John Doe")
                .username("johndoe")
                .email("john@example.com")
                .password("encoded_password")
                .role(Role.USER)
                .enabled(true)
                .build();
    }

    @Test
    @DisplayName("Ro'yxatdan o'tish: Muvaffaqiyatli")
    void testRegister_Success() {
        AuthDto.RegisterRequest request = new AuthDto.RegisterRequest();
        request.setFullName("John Doe");
        request.setUsername("johndoe");
        request.setEmail("john@example.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded_password");
        when(emailTemplateService.processTemplate(anyString(), anyMap())).thenReturn("email_body");

        assertDoesNotThrow(() -> authService.register(request));

        verify(userRepository, times(1)).save(any(UserEntity.class));
        verify(redisService, times(1)).saveOtp(eq("john@example.com"), anyString());
    }

    @Test
    @DisplayName("Ro'yxatdan o'tish: Email allaqachon mavjud bo'lsa xato berishi kerak")
    void testRegister_UserAlreadyExists_ThrowsException() {
        AuthDto.RegisterRequest request = new AuthDto.RegisterRequest();
        request.setEmail("john@example.com");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThrows(CustomBadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Email tasdiqlash: To'g'ri OTP bilan hisob faollashishi kerak")
    void testVerifyEmail_Success() {
        AuthDto.VerifyEmailRequest request = new AuthDto.VerifyEmailRequest();
        request.setEmail("john@example.com");
        request.setOtp("123456");

        testUser.setEnabled(false);

        when(redisService.getOtp("john@example.com")).thenReturn("123456");
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));
        when(jwtUtil.generateAccessToken(testUser)).thenReturn("access_token");
        when(jwtUtil.generateRefreshToken(testUser)).thenReturn("refresh_token");

        AuthDto.AuthResponse result = authService.verifyEmail(request, response);

        assertNotNull(result);
        assertEquals("access_token", result.accessToken());
        assertTrue(testUser.isEnabled());
        verify(userRepository, times(1)).save(testUser);
        verify(redisService, times(1)).deleteOtp("john@example.com");
        verify(cookieUtil, times(1)).addCookie("refresh_token", response);
    }

    @Test
    @DisplayName("Email tasdiqlash: Noto'g'ri yoki muddati o'tgan OTP")
    void testVerifyEmail_InvalidOtp_ThrowsException() {
        AuthDto.VerifyEmailRequest request = new AuthDto.VerifyEmailRequest();
        request.setEmail("john@example.com");
        request.setOtp("999999");

        when(redisService.getOtp("john@example.com")).thenReturn("123456");

        assertThrows(CustomBadRequestException.class, () -> authService.verifyEmail(request, response));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Login: Muvaffaqiyatli kirish")
    void testLogin_Success() {
        AuthDto.LoginRequest request = new AuthDto.LoginRequest();
        request.setEmail("john@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "encoded_password")).thenReturn(true);
        when(jwtUtil.generateAccessToken(testUser)).thenReturn("access_token");
        when(jwtUtil.generateRefreshToken(testUser)).thenReturn("refresh_token");

        AuthDto.AuthResponse authResponse = authService.login(request, response);

        assertNotNull(authResponse);
        assertEquals("access_token", authResponse.accessToken());
        verify(tokenService, times(1)).saveToken(testUser, "refresh_token");
        verify(cookieUtil, times(1)).addCookie("refresh_token", response);
    }

    @Test
    @DisplayName("Login: Nofaol hisob bo'lsa xato berishi kerak")
    void testLogin_InactiveAccount_ThrowsException() {
        AuthDto.LoginRequest request = new AuthDto.LoginRequest();
        request.setEmail("john@example.com");
        request.setPassword("password123");

        testUser.setEnabled(false);
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));

        assertThrows(CustomBadRequestException.class, () -> authService.login(request, response));
    }

    @Test
    @DisplayName("Login: Noto'g'ri parol bo'lsa xato berishi kerak")
    void testLogin_WrongPassword_ThrowsException() {
        AuthDto.LoginRequest request = new AuthDto.LoginRequest();
        request.setEmail("john@example.com");
        request.setPassword("wrongpassword");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpassword", "encoded_password")).thenReturn(false);

        assertThrows(CustomBadRequestException.class, () -> authService.login(request, response));
    }

    @Test
    @DisplayName("Logout: Token o'chirilishi va cookie tozalanishi")
    void testLogout_Success() {
        String token = "valid_refresh_token";
        TokenEntity tokenEntity = new TokenEntity();
        tokenEntity.setUser(testUser);
        tokenEntity.setRefreshToken(token);

        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.getSubject(token)).thenReturn("john@example.com");
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));
        when(tokenService.getToken(testUser)).thenReturn(tokenEntity);

        authService.logout(token, response);

        verify(tokenService, times(1)).deleteToken(testUser);
        verify(cookieUtil, times(1)).clearCookie(response);
    }

    @Test
    @DisplayName("Refresh: Yangi access token muvaffaqiyatli qaytarilishi")
    void testRefresh_Success() {
        String token = "valid_refresh_token";
        TokenEntity tokenEntity = new TokenEntity();
        tokenEntity.setUser(testUser);
        tokenEntity.setRefreshToken(token);

        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.getSubject(token)).thenReturn("john@example.com");
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));
        when(tokenService.getToken(testUser)).thenReturn(tokenEntity);
        when(jwtUtil.generateAccessToken(testUser)).thenReturn("new_access_token");
        when(jwtUtil.generateRefreshToken(testUser)).thenReturn("new_refresh_token");

        AuthDto.AuthResponse authResponse = authService.refresh(token, response);

        assertNotNull(authResponse);
        assertEquals("new_access_token", authResponse.accessToken());
    }

    @Test
    @DisplayName("Reset Password: Parollar mos kelmasa xato")
    void testResetPassword_Mismatch_ThrowsException() {
        AuthDto.ResetPasswordRequest request = new AuthDto.ResetPasswordRequest();
        request.setToken("reset_token");
        request.setPassword("newpass123");
        request.setConfirmPassword("different123");

        assertThrows(CustomBadRequestException.class, () -> authService.resetPassword(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Reset Password: Muvaffaqiyatli yangilash")
    void testResetPassword_Success() {
        AuthDto.ResetPasswordRequest request = new AuthDto.ResetPasswordRequest();
        request.setToken("reset_token");
        request.setPassword("newpass123");
        request.setConfirmPassword("newpass123");

        when(jwtUtil.validateToken("reset_token")).thenReturn(true);
        when(jwtUtil.getSubject("reset_token")).thenReturn("john@example.com");
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode("newpass123")).thenReturn("new_encoded_password");

        assertDoesNotThrow(() -> authService.resetPassword(request));

        assertEquals("new_encoded_password", testUser.getPassword());
        verify(userRepository, times(1)).save(testUser);
        verify(tokenService, times(1)).deleteToken(testUser);
    }

    @Test
    @DisplayName("Google Login: Yangi foydalanuvchi yaratilib login qilinishi")
    void testProcessGoogleLogin_NewUser() {
        when(userRepository.findByEmail("googleuser@gmail.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(UserEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtUtil.generateAccessToken(any(UserEntity.class))).thenReturn("google_access_token");
        when(jwtUtil.generateRefreshToken(any(UserEntity.class))).thenReturn("google_refresh_token");

        AuthDto.AuthResponse authResponse = authService.processGoogleLogin("googleuser@gmail.com", "Google User", "http://photo.jpg", response);

        assertNotNull(authResponse);
        assertEquals("google_access_token", authResponse.accessToken());
        verify(userRepository, times(1)).save(argThat(user ->
                user.getEmail().equals("googleuser@gmail.com") && user.isEnabled()
        ));
    }

    @Test
    @DisplayName("Joriy foydalanuvchi ma'lumotlarini olish (getCurrentUser)")
    void testGetCurrentUser_Success() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));

        AuthDto.UserResponse userResponse = authService.getCurrentUser("john@example.com");

        assertNotNull(userResponse);
        assertEquals("john@example.com", userResponse.email());
        assertEquals("John Doe", userResponse.fullName());
        assertEquals("USER", userResponse.role());
    }
}
