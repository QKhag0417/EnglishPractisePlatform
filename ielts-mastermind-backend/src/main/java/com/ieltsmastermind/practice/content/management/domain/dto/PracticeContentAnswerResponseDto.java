package com.ieltsmastermind.practice.content.management.domain.dto;

import com.ieltsmastermind.practice.content.management.domain.enums.PracticeQuestionType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PracticeContentAnswerResponseDto {
    private String id;
    private List<QuestionAnswerDto> answers;

    @Getter
    @Setter
    public static class QuestionAnswerDto {
        private Integer orderIndex;
        private List<String> correctAnswers;
    }
}
