package org.example.fgback.userManager;


import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface userRepo extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    // --- '이메일'로 유저를 찾는 기능을 추가 ---
    // (이메일 중복 체크 시 사용)
    Optional<User> findByEmail(String email);

    User findUserByEmail(String email);

}