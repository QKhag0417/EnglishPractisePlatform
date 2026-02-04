package com.ieltsmastermind.practice.content.management.domain.dto;

import com.ieltsmastermind.practice.content.management.domain.enums.PracticeContentSkill;
import com.ieltsmastermind.practice.content.management.domain.enums.PracticeContentStatus;
import com.ieltsmastermind.practice.content.management.domain.enums.PracticeTaskType;
import com.ieltsmastermind.practice.content.management.domain.enums.PracticeQuestionType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
public class PracticeContentCreateRequestDto {

    // PracticeContent fields
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
    private PracticeContentStatus status;

    // Nested questions + answers
    private List<PracticeQuestionCreateRequestDto> questions;

    @Getter
    @Setter
    public static class PracticeQuestionCreateRequestDto {

        private Integer orderIndex;
        private PracticeQuestionType type;
    }
}
