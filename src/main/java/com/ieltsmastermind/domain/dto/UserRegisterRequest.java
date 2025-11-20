package com.ieltsmastermind.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserRegisterRequest {

    private String email;
    private String password;
    private String firstname;
    private String lastname;
}