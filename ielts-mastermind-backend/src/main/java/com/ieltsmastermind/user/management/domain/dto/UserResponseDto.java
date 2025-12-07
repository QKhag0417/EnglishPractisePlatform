package com.ieltsmastermind.user.management.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserResponseDto {
    private String userId;
    private String email;
    private String phone;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
    private String role;
    private String firstname;
    private String lastname;
    private String country;
    private String timezone;
    private String avatarUrl;
    private Integer targetBand;
    private LocalDateTime examDate;
}
