package com.ieltsmastermind.practice.content.management.domain.dto;

import com.ieltsmastermind.practice.content.management.domain.enums.PracticeTaskType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PracticeContentPromptResponseDto {
    private String id;
    private PracticeTaskType task;
    private Integer duration;
    private String audioUrl;
    private String examText;
    private Integer totalQuestions;
}
