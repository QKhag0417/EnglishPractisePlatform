package com.ieltsmastermind.practice.content.management.domain.entity;

import com.ieltsmastermind.practice.content.management.domain.enums.PracticeContentSkill;
import com.ieltsmastermind.practice.content.management.domain.enums.PracticeContentStatus;
import com.ieltsmastermind.practice.content.management.domain.enums.PracticeTaskType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "practice_content")
public class PracticeContent {

    @Id
    @Column(name = "practice_content_id", nullable = false, updatable = false)
    private String id = UUID.randomUUID().toString();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PracticeContentSkill skill;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PracticeTaskType task;

    @ElementCollection
    @CollectionTable(
            name = "practice_content_question_type_tag",
            joinColumns = @JoinColumn(name = "practice_content_id")
    )
    @Column(name = "tag")
    private Set<String> questionTypeTags = new HashSet<>();

    @ElementCollection
    @CollectionTable(
            name = "practice_content_topic_tag",
            joinColumns = @JoinColumn(name = "practice_content_id")
    )
    @Column(name = "tag")
    private Set<String> topicTags = new HashSet<>();

    private String thumbnailUrl;
    private String audioUrl;

    private Integer durationMinutes;
    private Integer questionCount;

    private LocalDateTime updatedOn;
    private LocalDateTime createdOn;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PracticeContentStatus status;
}
