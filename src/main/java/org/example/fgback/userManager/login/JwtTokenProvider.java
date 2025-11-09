package org.example.fgback.userManager.login;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.util.Date;
import java.nio.charset.StandardCharsets;

@Component
public class JwtTokenProvider {

    // application.properties 에 설정할 비밀 키
    @Value("${jwt.secret}")
    private String secretKeyString;

    private SecretKey secretKey;

    // 토큰 유효시간 30분
    private final long tokenValidTime = 30 * 60 * 1000L;

    // 객체 초기화, secretKey를 Base64로 인코딩
    @PostConstruct
    protected void init() {
        // 🚨 중요: 'jwt.secret' 값은 32바이트 (영문/숫자 32자) 이상이어야 함!
        this.secretKey = Keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
    }

    // JWT 토큰 생성
    public String createToken(String userEmail) {
        Claims claims = Jwts.claims().setSubject(userEmail); // JWT payload 에 저장되는 정보단위
        Date now = new Date();

        return Jwts.builder()
                .setClaims(claims) // 정보 저장
                .setIssuedAt(now) // 토큰 발행 시간 정보
                .setExpiration(new Date(now.getTime() + tokenValidTime)) // set Expire Time
                .signWith(secretKey, SignatureAlgorithm.HS256)  // 사용할 암호화 알고리즘
                .compact();
    }

    // JWT 토큰에서 인증 정보 조회 (이메일 꺼내기)
    public String getEmailFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            // 토큰이 유효하지 않으면 예외 발생
            return null;
        }
    }

    // 토큰의 유효성 + 만료일자 확인
    public boolean validateToken(String jwtToken) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(jwtToken);
            return true;
        } catch (Exception e) {
            // (SignatureException, MalformedJwtException, ExpiredJwtException,
            // UnsupportedJwtException, IllegalArgumentException 등)
            return false;
        }
    }
}