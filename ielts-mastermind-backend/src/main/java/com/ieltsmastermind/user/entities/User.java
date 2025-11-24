package com.ieltsmastermind.user.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "user")
public class User {
    @Id
    private String userId = UUID.randomUUID().toString();

    @Column(nullable = false, unique = true)
    private String email;

    @Column(unique = true)
    private String phone;

    @Column(nullable = false)
    private String passwordHash;

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
