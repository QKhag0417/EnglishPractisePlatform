package com.ieltsmastermind.practice.content.management.domain.dto;

import com.ieltsmastermind.practice.content.management.domain.enums.PracticeContentSkill;
import com.ieltsmastermind.practice.content.management.domain.enums.PracticeContentStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PracticeContentMetadataV2ResponseDto {
    private String id;
    private String title;
    private PracticeContentSkill skill;
    private LocalDateTime updatedOn;
    private Integer questions;
    private Integer duration;
    private Long attempts;
    private PracticeContentStatus status;
}
