package org.example.fgback.userManager;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class userSecurity {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // (4) CSRF 보호 비활성화 (API 서버는 보통 비활성화)
                .csrf(csrf -> csrf.disable())

                // 세션 관리 정책 설정
               .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                 .authorizeHttpRequests(authz -> authz
                        // '/api/users/register'는 모두 접근가능
                        .requestMatchers("/api/users/register").permitAll()
                         .requestMatchers("/api/users/login").permitAll()
                        // 그 외의 모든 요청은 '인증된' 사용자만 가능
                        .anyRequest().authenticated()
                );

        return http.build();
    }
    @Bean//송맍ㄴ
    public CorsConfigurationSource corsConfigurationSource() { // <--- [수정 포인트 2]
        CorsConfiguration config = new CorsConfiguration();

        // 민준학생의 React 앱 주소(http://localhost:3000)를 허용
        config.setAllowedOrigins(Arrays.asList("http://127.0.0.1:5500"));

        // 허용할 HTTP 메소드 (GET, POST, PUT, DELETE 등)
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 허용할 HTTP 헤더
        config.setAllowedHeaders(Arrays.asList("*"));

        // (선택) 쿠키 등 자격 증명을 허용할지
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // "/**" (모든 경로)에 대해 위에서 만든 CORS 설정(config)을 적용
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}