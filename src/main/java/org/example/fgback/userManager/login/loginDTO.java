package org.example.fgback.userManager.login;

import jakarta.validation.constraints.Email;

import jakarta.validation.constraints.NotBlank;

import jakarta.validation.constraints.Size;

import lombok.Getter;

import lombok.Setter;



@Getter

@Setter

public class loginDTO {

    @NotBlank(message = "비밀번호는 비워둘 수 없습니다.")

    @Size(min = 6, message = "비밀번호는 6자 이상으로 입력해주세요.")

    private String password;



    @NotBlank(message = "이메일은 비워둘 수 없습니다.")

    @Email(message = "유효한 이메일 형식이 아닙니다.")

    private String email;

}