package org.example.fgback.apiServer.important;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.fgback.userManager.User;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "important_policies",//중복 즐찾 방지
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "policyId"})
        }
)

public class importantPolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 우리 DB에서 쓸 고유 ID

    // 즐겨찾기가 여러가지 일수도 있음
    @ManyToOne(fetch = FetchType.EAGER) // 코딩의 간편성을 위해 동일하게 EAGER로 변경
    @JoinColumn(name = "user_id", nullable = false) //User 테이블과 연결
    private User user;

    @Column(nullable = false)
    private String policyId; // 정책 아이디

    @Column(nullable = false)
    private String policyName; // 정책 이름

    private String startDate; // 시작일

    private String endDate; // 종료일

    private String policyDetailUrl; // 정책 상세 URL (refUrlAddr1 값)

}
