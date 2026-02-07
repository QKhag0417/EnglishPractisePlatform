package com.ieltsmastermind.practice.content.management.domain.dto;

import com.ieltsmastermind.practice.content.management.domain.enums.PracticeContentSkill;
import com.ieltsmastermind.practice.content.management.domain.enums.PracticeContentStatus;
import com.ieltsmastermind.practice.content.management.domain.enums.PracticeTaskType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
public class PracticeContentMetadataResponseDto {
    private String id;
    private String title;
    private PracticeTaskType task;
    private Set<String> questionTypeTags;
    private Set<String> topicTags;
    private String thumbnailUrl;
    private Integer durationMinutes;
    private Integer questionCount;
    private PracticeContentStatus status;
    private LocalDateTime updatedOn;
    private PracticeContentSkill skill;
    private Integer attempts;
}
