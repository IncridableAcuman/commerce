package com.commerce.server.util;

import com.commerce.server.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.access_time}")
    private int accessTime;
    @Value("${jwt.refresh_time}")
    private int refreshTime;
    private Key key;

    @PostConstruct
    public void init(){
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String createToken(User user,int expirationTime){
        return
                Jwts
                        .builder()
                        .setSubject(user.getEmail())
                        .claim("id",user.getId())
                        .claim("role",user.getRole())
                        .setIssuedAt(new Date())
                        .setExpiration(new Date(System.currentTimeMillis()+expirationTime))
                        .signWith(key)
                        .compact();
    }
    public String generateAccessToken(User user){
        return createToken(user,accessTime);
    }
    public String generateRefreshToken(User user){
        return createToken(user,refreshTime);
    }
    public Claims extractClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    public String extractSubject(String token){
        return extractClaims(token).getSubject();
    }
    public Date extractExpiration(String token){
        return extractClaims(token).getExpiration();
    }
    public boolean validateToken(String token, UserDetails userDetails){
        try {
            String email = extractSubject(token);
            return extractExpiration(token).after(new Date()) && email.equals(userDetails.getUsername());
        } catch (Exception e){
            return false;
        }
    }
}
