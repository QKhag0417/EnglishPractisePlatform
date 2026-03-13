package com.ieltsmastermind.practice.attempt.management.domain.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.ieltsmastermind.practice.content.management.domain.entity.PracticeContent;
import com.ieltsmastermind.user.management.domain.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "user_practice_submission")
public class UserPracticeSubmission {

    @Id
    @Column(name = "user_practice_submission_id", nullable = false, updatable = false)
    private String id = UUID.randomUUID().toString();

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "practice_content_id", nullable = false)
    private String practiceContentId;

    @Column(name = "time_spent_seconds", nullable = false)
    private Integer timeSpentSeconds;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column(name = "score", nullable = false)
    private Double score = 0.0;

    @Column(name = "correct_answer_count", nullable = false)
    private Integer correctAnswerCount = 0;

    @Column(name = "wrong_answer_count", nullable = false)
    private Integer wrongAnswerCount = 0;

    @Column(name = "skip_answer_count", nullable = false)
    private Integer skipAnswerCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "practice_content_id", referencedColumnName = "practice_content_id",
            insertable = false, updatable = false)
    private PracticeContent practiceContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id",
            insertable = false, updatable = false)
    private User user;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<UserPracticeSubmissionAnswer> answerRows = new ArrayList<>();

    @OneToMany(mappedBy = "submission", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<UserPracticeWritingAnswer> writingAnswers = new ArrayList<>();
}