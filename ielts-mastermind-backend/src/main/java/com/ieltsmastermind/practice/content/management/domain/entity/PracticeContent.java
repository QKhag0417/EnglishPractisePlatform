package com.ieltsmastermind.practice.content.management.domain.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.ieltsmastermind.practice.attempt.management.domain.entity.UserPracticeContentProgress;
import com.ieltsmastermind.practice.attempt.management.domain.entity.UserPracticeSubmission;
import com.ieltsmastermind.practice.content.management.domain.enums.PracticeContentSkill;
import com.ieltsmastermind.practice.content.management.domain.enums.PracticeContentStatus;
import com.ieltsmastermind.practice.content.management.domain.enums.PracticeTaskType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "practice_content")
@Inheritance(strategy = InheritanceType.JOINED)
public class PracticeContent {

    @Id
    @Column(name = "practice_content_id", nullable = false, updatable = false)
    private String id = UUID.randomUUID().toString();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, updatable = false)
    private PracticeContentSkill skill;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "instructions_parsed", columnDefinition = "JSON")
    private JsonNode instructionsParsed;

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

    @ElementCollection
    @CollectionTable(
            name = "practice_content_images",
            joinColumns = @JoinColumn(name = "practice_content_id")
    )
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    private String thumbnailUrl;

    private Integer durationMinutes;
    private Integer questionCount;

    private LocalDateTime updatedOn;
    private LocalDateTime createdOn;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PracticeContentStatus status;

    @Column(name = "attempt_count", nullable = false)
    private Long attemptCount = 0L;

    @OneToMany(mappedBy = "practiceContent", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<PracticeQuestion> questions = new ArrayList<>();

    @OneToMany(mappedBy = "practiceContent", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<UserPracticeSubmission> submissions = new ArrayList<>();

    @OneToMany(mappedBy = "practiceContent", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<UserPracticeContentProgress> practiceContentProgresses = new ArrayList<>();

    protected PracticeContent(PracticeContentSkill skill) {
        this.skill = skill;
    }
}
