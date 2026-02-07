package com.ieltsmastermind.practice.content.management.business.interfaces;

import com.ieltsmastermind.practice.content.management.domain.dto.PracticeContentCreateRequestDto;
import com.ieltsmastermind.practice.content.management.domain.dto.PracticeContentInstructionResponseDto;
import com.ieltsmastermind.practice.content.management.domain.dto.PracticeContentResponseDto;
import com.ieltsmastermind.practice.content.management.domain.dto.PracticeContentUpdateRequestDto;
import jakarta.transaction.Transactional;

import java.util.List;

public interface PracticeContentService {

    PracticeContentResponseDto create(PracticeContentCreateRequestDto request);

    List<PracticeContentResponseDto> getAll();

    PracticeContentResponseDto getById(String id);

    PracticeContentInstructionResponseDto getInstructionByContentId(String id);

    PracticeContentResponseDto update(String id, PracticeContentUpdateRequestDto request);

    void delete(String id);
}
