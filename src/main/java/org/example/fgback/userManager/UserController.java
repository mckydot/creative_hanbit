package org.example.fgback.userManager;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders; // 이거 중요
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.example.fgback.userManager.login.JwtTokenProvider;

import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor // final 필드 생성자 주입 (Lombok)
public class UserController {

    private final JwtTokenProvider jwtUtil; // JWT 파싱 및 검증 유틸
    private final userRepo userService; // DB에서 사용자 조회 서비스

    /**
     * @PostMapping이 아니라 @GetMapping이 더 적절해. (정보를 조회하는 거니까)
     * 파라미터: @RequestParam이 아니라 @RequestHeader로 토큰을 받아야 해.
     */
    @GetMapping("/me")
    public ResponseEntity<?> myPage(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {

        // 1. 헤더에서 "Bearer " 접두어 제거하고 실제 토큰만 추출
        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }

        // 2. 토큰이 없거나 형식이 잘못된 경우
        if (token == null) {
            // 401 Unauthorized (권한 없음) 응답
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is missing or invalid format");
        }

        try {
            // 3. 토큰 유효성 검사 및 사용자 식별자(여기선 email) 추출
            if (!jwtUtil.validateToken(token)) { // (만료, 서명 검사 등)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token");
            }

            String email = jwtUtil.getEmailFromToken(token); // 토큰에서 이메일 정보 꺼내기

            // 4. 추출한 이메일로 DB에서 사용자 정보 조회
            User user = userService.findUserByEmail(email);

            // 5. 응답용 DTO 객체 생성 (비밀번호 등 민감 정보 제외)
            userDTO userInfo = new userDTO(user.getEmail(), user.getUsername(), user.getKeywords());

            // 6. 성공 응답 (HTTP 200 OK + 사용자 정보)
            return ResponseEntity.ok(userInfo);

        } catch (ExpiredJwtException e) {
            // 7. 토큰 만료 시
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token expired");
        } catch (JwtException | IllegalArgumentException e) {
            // 8. 토큰 파싱 오류 또는 잘못된 토큰
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token");
        } catch (NoSuchElementException e) {
            // 9. 토큰은 유효하나, 해당 이메일의 유저가 DB에 없을 때 (드문 경우)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
}