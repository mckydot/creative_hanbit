package org.example.fgback.apiServer.important;

import lombok.RequiredArgsConstructor;
import org.example.fgback.userManager.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.example.fgback.userManager.userRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class important {
    private final importantPolicyRepo importantPolicyRepo;

    // User 정보를 가져올 레포지토리 (이건 이미 있다고 가정할게)
    private final userRepo userRepository;

    public void addImportantPolicy(Long userId, importantDTO dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. ID: " + userId));

        Optional<importantPolicy> existing = importantPolicyRepo.findByUserIdAndPolicyId(userId, dto.getPolicyId());

        // 3. (새로 추가) DTO를 Entity로 변환
        importantPolicy newPolicy = new importantPolicy();
        newPolicy.setUser(user); // 1번에서 찾은 User 객체
        newPolicy.setPolicyId(dto.getPolicyId());
        newPolicy.setPolicyName(dto.getPolicyName());
        newPolicy.setStartDate(dto.getStartDate());
        newPolicy.setEndDate(dto.getEndDate());
        newPolicy.setPolicyDetailUrl(dto.getPolicyDetailUrl());

        // 4. DB에 저장 (레포지토리 사용)
        importantPolicyRepo.save(newPolicy);
    }
    public void removeImportantPolicy(Long userId, String policyId) {

        importantPolicy policyToRemove = importantPolicyRepo.findByUserIdAndPolicyId(userId, policyId)
                .orElseThrow(() -> new IllegalArgumentException("즐겨찾기 정보를 찾을 수 없습니다."));

        // 2. DB에서 삭제
        importantPolicyRepo.delete(policyToRemove);
    }
}
