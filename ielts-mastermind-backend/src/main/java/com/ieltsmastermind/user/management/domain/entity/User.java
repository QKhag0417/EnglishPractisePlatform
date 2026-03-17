package com.ieltsmastermind.user.management.domain.entity;

import com.ieltsmastermind.user.management.domain.enums.AuthProvider;
import com.ieltsmastermind.practice.attempt.management.domain.entity.UserPracticeContentProgress;
import com.ieltsmastermind.practice.attempt.management.domain.entity.UserPracticeSubmission;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "user")
public class User {

    @Id
    @Column(name = "user_id", nullable = false, updatable = false)
    private String userId = UUID.randomUUID().toString();

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider provider;

    @Column(name = "provider_id", length = 100)
    private String providerId;


    @Column(unique = true)
    private String phoneNumber;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "is_active")
    private Boolean isActive;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "role")
    private String role;

    @Column(name = "firstname")
    private String firstname;

    @Column(name = "lastname")
    private String lastname;

    @Column(name = "gender")
    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "country")
    private String country;

    @Column(name = "timezone")
    private String timezone;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "target_band")
    private Integer targetBand;

    @Column(name = "exam_date")
    private LocalDateTime examDate;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<UserPracticeSubmission> practiceSubmissions = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<UserPracticeContentProgress> practiceContentProgresses = new ArrayList<>();
}
