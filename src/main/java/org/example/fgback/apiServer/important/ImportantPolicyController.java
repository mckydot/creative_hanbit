// ImportantPolicyController.java

package org.example.fgback.apiServer.important;

import lombok.RequiredArgsConstructor;
import org.example.fgback.userManager.PrincipalDetails; // (주의!) 이건 민준학생의 UserDetails 구현체여야 해
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/important") // API 주소 (예: /api/important)
@RequiredArgsConstructor
public class ImportantPolicyController {

    private final important importantPolicyService;

    /**
     * 즐겨찾기 (중요 공지) 추가 API
     */
    @PostMapping
    public ResponseEntity<?> addImportantPolicy(

            @AuthenticationPrincipal PrincipalDetails principalDetails,

            @RequestBody importantDTO dto
    ) {

        // 3. 사용자 정보에서 Long 타입의 ID를 꺼냄
        //    (이 부분은 민준학생의 UserDetails 구현에 따라 달라져!)
        //    예시: principalDetails.getUser().getId()
        //    예시: principalDetails.getId()
        Long userId = principalDetails.getUser().getId(); // 예시일 뿐이야!

        // 4. 서비스 로직 호출
        importantPolicyService.addImportantPolicy(userId, dto);

        return ResponseEntity.ok("즐겨찾기에 추가되었습니다.");
    }

    /**
     * 즐겨찾기 (중요 공지) 삭제 API
     */
    @DeleteMapping("/{policyId}")
    public ResponseEntity<?> removeImportantPolicy(


            @AuthenticationPrincipal PrincipalDetails principalDetails,

            @PathVariable String policyId
    ) {

        Long userId = principalDetails.getUser().getId();

        importantPolicyService.removeImportantPolicy(userId, policyId);

        return ResponseEntity.ok("즐겨찾기에서 삭제되었습니다.");
    }
}