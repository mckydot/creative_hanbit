package org.example.fgback.apiServer.important;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

// JpaRepository<[관리할 엔티티], [엔티티의 ID 타입]>
public interface importantPolicyRepo extends JpaRepository<importantPolicy, Long> {
    List<importantPolicy> findByUser_Id(Long userId);

    Optional<importantPolicy> findByUserIdAndPolicyId(Long userId, String policyId);
}