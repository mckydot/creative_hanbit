package org.example.fgback.apiServer.important;
import lombok.Data;
@Data
public class importantDTO {
    private String policyId;       // 정책 아이디
    private String policyName;     // 정책 이름
    private String startDate;      // 시작일
    private String endDate;        // 종료일
    private String policyDetailUrl; // 정책 상세 URL
}
