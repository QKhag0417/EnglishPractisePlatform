package com.ieltsmastermind.practice.content.management.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PracticeContentInstructionResponseDto {
    private String id;
    private String title;
    private Integer timeInfo;
    private List<String> candidateInstructions;
    private List<String> candidateInfo;
}
