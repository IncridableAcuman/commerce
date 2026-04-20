package com.commerce.server.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {
    @Value("${jwt.refresh_time}")
    private int refreshTime;

    public void cookieManagement(String refreshToken, int expirationTime, HttpServletResponse response){
        Cookie cookie = new Cookie("refreshToken",refreshToken);
        cookie.setHttpOnly(true);
        cookie.setValue(refreshToken);
        cookie.setMaxAge(expirationTime);
        cookie.setSecure(false);
        cookie.setPath("/");
        response.addCookie(cookie);
    }
    public void addCookie(String refreshToken,HttpServletResponse response){
        cookieManagement(refreshToken,refreshTime,response);
    }
    public void clearCookie(HttpServletResponse response){
        cookieManagement(null,0,response);
    }
}
