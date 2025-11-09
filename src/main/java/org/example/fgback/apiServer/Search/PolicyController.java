package org.example.fgback.apiServer.Search;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/policies") // 예시 경로
public class PolicyController {
// ... (기존 import 및 클래스 선언은 동일)
private final PolicyService policyService;

    @Autowired
    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    // --- 기존 /names 엔드포인트는 그대로 두고 ---

    // --- 이름으로 검색하는 엔드포인트 추가 ---
    @GetMapping("/search") // '/api/policies/search' 주소로 GET 요청 처리
    public ResponseEntity<String> searchPolicies(@RequestParam("name") String policyName) {
        // @RequestParam("name"): URL 파라미터 ?name=값 을 policyName 변수에 넣어줌
        String resultJson = policyService.searchPoliciesByName(policyName);

        // Service에서 받은 JSON 문자열을 그대로 응답 본문(body)에 담아 반환
        // Content-Type 헤더를 application/json으로 설정해서 브라우저가 JSON으로 인식하게 함
        return ResponseEntity.ok()
                .header("Content-Type", "application/json; charset=UTF-8")
                .body(resultJson);
    }
}