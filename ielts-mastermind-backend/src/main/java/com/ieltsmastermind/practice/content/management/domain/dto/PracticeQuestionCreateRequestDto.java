package com.ieltsmastermind.practice.content.management.domain.dto;

import com.ieltsmastermind.practice.content.management.domain.enums.PracticeQuestionType;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class PracticeQuestionCreateRequestDto {

    private Integer orderIndex;
    private PracticeQuestionType type;
    private List<String> correctAnswers = new ArrayList<>();
}
