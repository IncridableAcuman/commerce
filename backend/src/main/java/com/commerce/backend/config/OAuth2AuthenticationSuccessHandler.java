package com.commerce.backend.config;

import com.commerce.backend.dto.AuthDto;
import com.commerce.backend.service.AuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AuthService authService;

    @Value("${client.url:http://localhost:5173}")
    private String clientUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        if (authentication.getPrincipal() instanceof OAuth2User oauth2User) {
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");
            String picture = oauth2User.getAttribute("picture");

            if (email != null) {
                AuthDto.AuthResponse authResponse = authService.processGoogleLogin(email, name, picture, response);
                String targetUrl = clientUrl + "/auth/callback?token=" + URLEncoder.encode(authResponse.accessToken(), StandardCharsets.UTF_8);
                getRedirectStrategy().sendRedirect(request, response, targetUrl);
                return;
            }
        }
        getRedirectStrategy().sendRedirect(request, response, clientUrl + "/auth?error=oauth_failed");
    }
}
