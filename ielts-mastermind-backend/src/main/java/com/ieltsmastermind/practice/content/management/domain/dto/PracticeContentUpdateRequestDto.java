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
public class PracticeContentUpdateRequestDto {

    private PracticeContentSkill skill;
    private String title;
    private String instructions;
    private PracticeTaskType task;
    private Set<String> questionTypeTags;
    private Set<String> topicTags;
    private String thumbnailUrl;
    private String audioUrl;
    private List<String> imageUrls;
    private String passage;
    private Integer durationMinutes;
    private Integer questionCount;
    private PracticeContentStatus status;
}
