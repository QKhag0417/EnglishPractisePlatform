package com.ieltsmastermind.practice.attempt.management.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "user_practice_writing_answer")
public class UserPracticeWritingAnswer {

    @Id
    @Column(name = "user_practice_writing_answer_id", nullable = false, updatable = false)
    private String id = UUID.randomUUID().toString();

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Lob
    @Column(name = "essay_text", nullable = false, columnDefinition = "TEXT")
    private String essayText;

    @Column(name = "word_count", nullable = false)
    private Integer wordCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_practice_submission_id", updatable = false)
    private UserPracticeSubmission submission;
}