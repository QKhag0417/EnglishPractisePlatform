package com.ieltsmastermind.authentication.domain.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterRequestDto {
    private String email;
    private String password;
    private String firstname;
    private String lastname;
}