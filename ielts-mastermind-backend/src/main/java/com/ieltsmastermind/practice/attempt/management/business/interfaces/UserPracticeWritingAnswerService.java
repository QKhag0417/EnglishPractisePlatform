package com.ieltsmastermind.practice.attempt.management.business.interfaces;

import com.ieltsmastermind.practice.attempt.management.domain.dto.UserPracticeWritingAnswerCreateRequestDto;
import com.ieltsmastermind.practice.attempt.management.domain.dto.UserPracticeWritingAnswerResponseDto;

public interface UserPracticeWritingAnswerService {

    UserPracticeWritingAnswerResponseDto create(
            UserPracticeWritingAnswerCreateRequestDto request
    );
}
