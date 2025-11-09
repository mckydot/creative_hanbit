package org.example.fgback.apiServer.Search;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Service
public class PolicyService {
    private final RestTemplate restTemplate;

    @Autowired
    public PolicyService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // --- 기존 getPolicyNames() 메소드는 그대로 두고 ---

    // --- 정책 이름으로 검색하는 메소드 추가 ---
    public String searchPoliciesByName(String policyName) { // 정책 이름을 파라미터로 받음
        String baseUrl = "https://www.youthcenter.go.kr/go/ythip/getPlcy";

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("apiKeyNm", "149e8d9f-2d8a-47e9-96e0-8abaa0579ab6") // 키
                .queryParam("rtnType", "json")             // 결과값 형식
                .queryParam("plcyNm", policyName)          // !! 받은 정책 이름으로 검색
                .queryParam("pageSize", "5");             // 일단 예시롷 5개 불러옴
        URI finalUri = builder.build().encode().toUri();

        System.out.println("Request URL: " + finalUri); // 어떤 URL로 요청했는지 로그 찍어보기

        try {
            // API 호출하고 결과를 String(JSON 문자열)으로 바로 받기
            String jsonResponse = restTemplate.getForObject(finalUri, String.class);

            // !! 결과 확인을 위해 콘솔에 그대로 출력 !!
            System.out.println("API Response JSON:");
            System.out.println(jsonResponse);

            return jsonResponse; // 받은 JSON 문자열을 그대로 반환

        } catch (Exception e) {
            System.err.println("API 호출 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return "{\"error\": \"API 호출 실패: " + e.getMessage() + "\"}"; // 오류 발생 시 에러 메시지 반환
        }
    }
}
