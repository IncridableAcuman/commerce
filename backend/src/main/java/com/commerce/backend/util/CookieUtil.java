package com.commerce.backend.util;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {
    @Value("${jwt.refresh_time}")
    private long refreshTime;

    private void cookieManagement(String refreshToken, long expiration, HttpServletResponse response){
        ResponseCookie cookie = ResponseCookie
                .from("refreshToken",refreshToken)
                .maxAge(expiration)
                .path("/")
                .httpOnly(true)
                .sameSite("Lax")
                .secure(false)
                .value(refreshToken)
                .build();

        response.addHeader("Set-Cookie",cookie.toString());
    }
    public void addCookie(String refreshToken,HttpServletResponse response){
        cookieManagement(refreshToken,refreshTime/1000,response);
    }
    public void clearCookie(HttpServletResponse response){
        cookieManagement(null,0,response);
    }
}
