package com.ieltsmastermind.practice.content.management.business;

import com.ieltsmastermind.practice.content.management.domain.dto.PracticeContentCreateRequestDto;
import com.ieltsmastermind.practice.content.management.domain.dto.PracticeContentResponseDto;

public interface PracticeContentService {

    PracticeContentResponseDto create(PracticeContentCreateRequestDto request);
}
