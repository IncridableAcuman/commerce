package com.commerce.backend.util;

import com.commerce.backend.entity.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String  secret;
    @Value("${jwt.refresh_time}")
    private long refreshTime;
    @Value("${jwt.access_time}")
    private long accessTime;
    private Key key;

    @PostConstruct
    private void init(){
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    private String generateToken(UserEntity user,long tokenExpiration){
        long currentMillis = System.currentTimeMillis();
        Date issueAt = new Date(currentMillis);
        Date expiration = new Date(currentMillis + tokenExpiration);
        Map<String,Object> claims = new HashMap<>();
        claims.put("id",user.getId());
        claims.put("role",user.getRole());
        return Jwts
                .builder()
                .addClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(issueAt)
                .setExpiration(expiration)
                .signWith(key)
                .compact();
    }
    public String generateRefreshToken(UserEntity user){
        return generateToken(user,refreshTime);
    }
    public String generateAccessToken(UserEntity user){
        return generateToken(user,accessTime);
    }
    private Claims extractClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    public String getSubject(String token){
        return extractClaims(token).getSubject();
    }
    private Date getExpiration(String token){
        return extractClaims(token).getExpiration();
    }
    private boolean isTokenExpired(String token){
        return getExpiration(token).before(new Date());
    }
    public boolean validateToken(String token){
        try {
            return getSubject(token) != null && !isTokenExpired(token);
        } catch (JwtException e){
            return false;
        }
    }
}
