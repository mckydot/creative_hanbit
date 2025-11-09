package org.example.fgback.userManager.regi;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class userDTO {

    @NotBlank(message = "사용자 ID는 비워둘 수 없습니다.")
    @Size(min = 4, max = 20, message = "사용자 ID는 4자 이상 20자 이하로 입력해주세요.")
    private String username;

    @NotBlank(message = "비밀번호는 비워둘 수 없습니다.")
    @Size(min = 6, message = "비밀번호는 6자 이상으로 입력해주세요.")
    private String password;

    @NotBlank(message = "이메일은 비워둘 수 없습니다.")
    @Email(message = "유효한 이메일 형식이 아닙니다.")
    private String email;

    private String city;

    private String distcit;

    private int year;

    private int month;

    private int day;

    private String job;

    private List<String> keywords;
}
