package com.example.prep_pilot.service;


import com.example.prep_pilot.jwt.JWTUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class ReissueService {

    private final JWTUtil jwtUtil;
    private final RedisTemplate<String, String> redisTemplate;

    public ReissueService(JWTUtil jwtUtil, RedisTemplate<String, String> redisTemplate){

        this.jwtUtil = jwtUtil;
        this.redisTemplate = redisTemplate;
    }

    public ResponseEntity<?> reissueToken(HttpServletRequest request, HttpServletResponse response) {

        // 1. Refresh Token 가져오기
        String refresh = getRefreshTokenFromCookies(request);
        if (refresh == null) {
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        // 2. Refresh Token 만료 체크
        try {
            if (jwtUtil.isExpired(refresh)) {
                return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
            }
        } catch (ExpiredJwtException e) {
            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        // 3. Redis에서 저장된 Refresh Token 검증
        String username = jwtUtil.getUsername(refresh);
        String storedToken = redisTemplate.opsForValue().get("refresh:" + username);
        if (storedToken == null || !storedToken.equals(refresh)) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        // 4. 새로운 Access Token 생성
        String role = jwtUtil.getRole(refresh);
        String newAccess = jwtUtil.createJwt("access", username, role, 600000L);
        String newRefresh = jwtUtil.createJwt("refresh", username, role, 86400000L);

        // 5. Redis에 새로운 Refresh Token 저장 (기존 토큰 갱신)
        redisTemplate.opsForValue().set("refresh:" + username, newRefresh, 86400, TimeUnit.SECONDS);

        // 6. 응답 헤더에 새 Access Token 설정
        response.setHeader("access", newAccess);
        response.addCookie(createCookie("refresh", newRefresh));

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private String getRefreshTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;

        for (Cookie cookie : cookies) {
            if ("refresh".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        cookie.setHttpOnly(true);

        return cookie;
    }
}
