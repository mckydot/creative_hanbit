package org.example.fgback.userManager.regi;


import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class userRegisterController {
    private final userRegister userService;

    public userRegisterController(userRegister userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    // 1. 반환 타입을 <String>에서 <?> (또는 <Object>)로 변경
    public ResponseEntity<?> registerUser(@Valid @RequestBody userDTO requestDTO) {

        try {
            userService.registerUser(requestDTO);

            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("success" , "1");
            responseBody.put("message", "회원가입이 성공적으로 완료되었습니다.");

            // 2. ".get("message")"를 빼고 'responseBody' (Map 객체 자체)를 전달!
            //    스프링이 이걸 알아서 JSON으로 바꿔줌
            return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);

        } catch (IllegalArgumentException e) {
            Map<String, String> errorBody = new HashMap<>();
            errorBody.put("message", e.getMessage());

            // 3. 여기도 'errorBody' (Map 객체 자체)를 전달!
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
        }
    }
}