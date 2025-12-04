package com.ieltsmastermind.practice.content.management.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "practice_answer_option")
public class PracticeAnswer {

    @Id
    @Column(name = "answer_option_id", nullable = false, updatable = false)
    private String id = UUID.randomUUID().toString();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private PracticeQuestion question;

    @Column(name = "order_index")
    private Integer orderIndex;

    // Short-text: null
    @Column(name = "display_text", columnDefinition = "TEXT")
    private String displayText;

    // Short-text: null
    @Column(name = "is_correct")
    private Boolean isCorrect = Boolean.FALSE;

    // MCQ: null
    @Column(name = "value")
    private String value;
}
