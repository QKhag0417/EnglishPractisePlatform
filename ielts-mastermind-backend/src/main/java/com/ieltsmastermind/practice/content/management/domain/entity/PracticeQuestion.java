package com.ieltsmastermind.practice.content.management.domain.entity;

import com.ieltsmastermind.practice.content.management.domain.enums.PracticeQuestionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "practice_question")
public class PracticeQuestion {

    @Id
    @Column(name = "practice_question_id", nullable = false, updatable = false)
    private String id = UUID.randomUUID().toString();

    // FK to PracticeContent
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "practice_content_id", nullable = false)
    private PracticeContent practiceContent;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PracticeQuestionType type;
}
