package org.example.fgback.userManager.regi;

import org.example.fgback.userManager.User;
import org.example.fgback.userManager.userRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class userRegister {

    private final userRepo userRepository;
    private final PasswordEncoder passwordEncoder; // (1) '암호화 로봇' 주입받기

    // (2) 생성자를 통해 필요한 부품들(Repository, PasswordEncoder)을 주입
    public userRegister(userRepo userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // (3) @Transactional: 이 메소드 전체가 하나의 '작업 단위'임을 선언
    //    (중간에 실패하면 DB 작업을 '롤백'시킴)
    @Transactional
    public User registerUser(userDTO requestDTO) {

        // --- 1. 중복 체크 ---
       if (userRepository.findByUsername(requestDTO.getUsername()).isPresent()) {
            // (실제로는 ControllerAdvice에서 처리하는 게 더 좋음)
            throw new IllegalArgumentException("이미 사용 중인 ID입니다: " + requestDTO.getUsername());
        }

        if (userRepository.findByEmail(requestDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다: " + requestDTO.getEmail());
        }

        // --- 2. 새 User 객체 생성 및 비밀번호 암호화 ---
        User newUser = new User();
        newUser.setUsername(requestDTO.getUsername());

        // (4) ★핵심★: '1234' -> 'asdf$2a$10$...' 암호화해서 저장
        newUser.setPassword(passwordEncoder.encode(requestDTO.getPassword()));

        newUser.setEmail(requestDTO.getEmail());

        newUser.setCity(requestDTO.getCity());
        newUser.setDistcit(requestDTO.getDistcit()); // (오타난 필드명 그대로 씀)
        newUser.setJob(requestDTO.getJob());
        newUser.setYear(requestDTO.getYear());
        newUser.setMonth(requestDTO.getMonth());
        newUser.setDay(requestDTO.getDay());
        newUser.setKeywords(requestDTO.getKeywords());

        // --- 3. DB에 저장 ---
        return userRepository.save(newUser);
    }
}

