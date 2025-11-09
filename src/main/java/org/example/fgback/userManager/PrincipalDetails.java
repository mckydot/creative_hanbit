package org.example.fgback.userManager;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

// 1. (핵심!) Spring Security의 표준 신분증인 'UserDetails'를 구현(implements)해야 해.
public class PrincipalDetails implements UserDetails {

    // 2. 우리가 만든 'User' 엔티티를 내부에 가지고 있어야 해.
    //    이게 바로 '신분증'의 '원본 정보'야.
    private User user;

    // 3. 생성자: '신분증'을 만들 때 '원본 정보(User)'를 받아서 저장해.
    public PrincipalDetails(User user) {
        this.user = user;
    }

    // 4. (중요!) 컨트롤러에서 User 객체를 통째로 꺼낼 수 있게 getter를 열어주자.
    //    이것 덕분에 나중에 'principalDetails.getUser().getId()'가 가능해져.
    public User getUser() {
        return user;
    }

    // --- (이 아래부터는 UserDetails 인터페이스가 꼭 만들라고 시키는 메서드들) ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 5. 이 사용자가 가진 '권한' 목록을 반환해.
        //    'role' 필드가 없다고 했으니, 모든 사용자가 'ROLE_USER' 권한을 갖는다고 '고정'할게.
        //    (나중에 관리자 기능이 필요하면 이 부분을 수정해야 해)
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        // 6. 이 사용자의 '비밀번호'를 반환해.
        return user.getPassword(); // User 엔티티의 getPassword() 호출
    }

    @Override
    public String getUsername() {
        // 7. 이 사용자의 'ID'를 반환해. (Spring Security는 이걸 'username'이라고 불러)
        //    (주의!) 민준학생은 'email'을 ID로 쓰는 것 같으니, getEmail()을 반환할게.
        return user.getEmail(); // User 엔티티의 getEmail() 호출
    }

    // --- (계정 상태 관련 - 지금은 일단 다 true로 해두면 돼) ---

    @Override
    public boolean isAccountNonExpired() {
        // 8. 계정이 만료되지 않았는가? (true = 만료 안 됨)
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // 9. 계정이 잠기지 않았는가? (true = 안 잠김)
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // 10. 비밀번호가 만료되지 않았는가? (true = 만료 안 됨)
        return true;
    }

    @Override
    public boolean isEnabled() {
        // 11. 계정이 활성화되었는가? (true = 활성화됨)
        return true;
    }
}