package com.ieltsmastermind.practice.content.management.domain.dto;

import com.ieltsmastermind.practice.content.management.domain.enums.PracticeContentSkill;
import com.ieltsmastermind.practice.content.management.domain.enums.PracticeContentStatus;
import com.ieltsmastermind.practice.content.management.domain.enums.PracticeTaskType;
import com.ieltsmastermind.practice.content.management.domain.enums.PracticeQuestionType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
public class PracticeContentResponseDto {

    private String id;

    private PracticeContentSkill skill;
    private String title;
    private String instructions;
    private PracticeTaskType task;

    private Set<String> questionTypeTags;
    private Set<String> topicTags;

    private String thumbnailUrl;
    private String audioUrl;

    private Integer durationMinutes;
    private Integer questionCount;

    private LocalDateTime createdOn;
    private LocalDateTime updatedOn;

    private PracticeContentStatus status;

    // Nested questions + answers
    private List<PracticeQuestionResponseDto> questions;


    @Getter
    @Setter
    public static class PracticeQuestionResponseDto {

        private String id;
        private Integer orderIndex;
        private PracticeQuestionType type;
    }
}
