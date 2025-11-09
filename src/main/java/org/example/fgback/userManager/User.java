package org.example.fgback.userManager;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

    @Entity
    @Getter
    @Setter
    @NoArgsConstructor
    @Table(name = "users")
    public class User  {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(unique = true, nullable = false,columnDefinition = "NVARCHAR(255)")
        private String username; // 로그인 ID

        @Column(unique = false, nullable = false,columnDefinition = "NVARCHAR(255)")
        private String city; // 도시

        @Column(nullable = false,columnDefinition = "NVARCHAR(255)")
        private String distcit; // 뭔지 모르겠음

        @Column(nullable = false,columnDefinition = "NVARCHAR(255)")
        private String job; // 직업

        @Column(nullable = false)
        private int year;//년도

        @Column(nullable = false)
        private int month;

        @Column(nullable = false)
        private int day;

        @Column(nullable = false)
        private String password; // 비밀번호

        @Column(unique = true, nullable = false,columnDefinition = "NVARCHAR(255)")
        private String email;    // 이메일

        @ElementCollection(fetch = FetchType.LAZY)//LAZY가 효율성이 높지만 코딩의 간평성을 고려해 EAGER로 변경.
        @CollectionTable(name = "keywords", joinColumns = @JoinColumn(name = "user_id"))
        @Column(name = "keywords",columnDefinition = "NVARCHAR(255)") // (3)
        private List<String> keywords = new ArrayList<>();

    }
