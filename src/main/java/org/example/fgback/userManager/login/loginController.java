package org.example.fgback.userManager.login;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import org.example.fgback.userManager.PrincipalDetails;

@RestController
@RequestMapping("/api/users")
public class loginController {
    private final userLoginService loginService;

    public loginController(userLoginService loginService) {
        this.loginService = loginService;
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody loginDTO requestDTO) {
        try {
            // 1. 로그인 서비스 호출, 성공하면 토큰을 받아옴
            String token = loginService.login(requestDTO);

            // 2. 성공 응답 구성 (토큰 + 메시지)
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("success", "1");
            responseBody.put("message", "로그인에 성공하였습니다.");
            responseBody.put("token", token); // ⭐️ 생성된 토큰을 클라이언트에 전달

            return ResponseEntity.ok(responseBody);

        } catch (IllegalArgumentException e) {
            // 3. 실패(이메일 없음, 비번 틀림) 응답
            Map<String, String> errorBody = new HashMap<>();
            errorBody.put("success", "0");
            errorBody.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody); // 401 Unauthorized
        }
    }
}
