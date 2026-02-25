package com.ieltsmastermind.practice.attempt.management.business.interfaces;

import com.ieltsmastermind.common.query.IncludeSpec;
import com.ieltsmastermind.practice.attempt.management.domain.dto.UserPracticeSubmissionCreateRequestDto;
import com.ieltsmastermind.practice.attempt.management.domain.dto.UserPracticeSubmissionResponseDto;

import java.util.List;

public interface UserPracticeSubmissionService {

    UserPracticeSubmissionResponseDto create(UserPracticeSubmissionCreateRequestDto request);
    List<UserPracticeSubmissionResponseDto> getAllByUserId(String userId, IncludeSpec includes);
    UserPracticeSubmissionResponseDto getById(String id, IncludeSpec includes);
}
