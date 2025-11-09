package org.example.fgback.userManager.login;

import org.example.fgback.userManager.User;
import org.example.fgback.userManager.userRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class userLoginService {
    private final userRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public userLoginService(userRepo userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepo = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public String login(loginDTO loginRequestDTO) {
        // 1. 이메일로 사용자가 있는지 확인
        User user = userRepo.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        // 2. 비밀번호가 일치하는지 확인
        if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 3. 로그인이 성공하면, 이메일 정보를 담아 JWT 토큰 생성
        return jwtTokenProvider.createToken(user.getEmail());
    }
}
