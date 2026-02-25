package com.ieltsmastermind.practice.attempt.management.business.interfaces;

import com.ieltsmastermind.common.query.IncludeSpec;
import com.ieltsmastermind.practice.attempt.management.domain.dto.UserPracticeSubmissionAnswerCreateRequestDto;
import com.ieltsmastermind.practice.attempt.management.domain.dto.UserPracticeSubmissionAnswerResponseDto;

import java.util.List;

public interface UserPracticeSubmissionAnswerService {

    UserPracticeSubmissionAnswerResponseDto create(UserPracticeSubmissionAnswerCreateRequestDto request);
    List<UserPracticeSubmissionAnswerResponseDto> getAllBySubmissionId(String submissionId, IncludeSpec includes);
    UserPracticeSubmissionAnswerResponseDto getById(String id, IncludeSpec includes);
}
