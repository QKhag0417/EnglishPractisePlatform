package com.ieltsmastermind.practice.content.management.business.interfaces;

import com.ieltsmastermind.practice.content.management.domain.dto.*;
import jakarta.transaction.Transactional;

import java.util.List;

public interface PracticeContentService {

    PracticeContentResponseDto create(PracticeContentCreateRequestDto request);

    List<PracticeContentResponseDto> getAll();

    PracticeContentResponseDto getById(String id);

    PracticeContentInstructionResponseDto getInstructionById(String id);

    PracticeContentPromptResponseDto getPromptById(String id);

    PracticeContentAnswerResponseDto getAnswersById(String id);

    List<PracticeContentMetadataResponseDto> getAllMetadata();

    List<PracticeContentMetadataV2ResponseDto> getAllMetadataV2();

    PracticeContentResponseDto update(String id, PracticeContentUpdateRequestDto request);

    void delete(String id);
}
