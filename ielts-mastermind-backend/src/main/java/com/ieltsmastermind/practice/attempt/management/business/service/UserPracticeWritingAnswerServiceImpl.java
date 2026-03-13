package com.ieltsmastermind.practice.attempt.management.business.service;

import com.ieltsmastermind.practice.attempt.management.business.interfaces.UserPracticeWritingAnswerService;
import com.ieltsmastermind.practice.attempt.management.domain.dto.UserPracticeWritingAnswerCreateRequestDto;
import com.ieltsmastermind.practice.attempt.management.domain.dto.UserPracticeWritingAnswerResponseDto;
import com.ieltsmastermind.practice.attempt.management.domain.entity.UserPracticeSubmission;
import com.ieltsmastermind.practice.attempt.management.domain.entity.UserPracticeWritingAnswer;
import com.ieltsmastermind.practice.attempt.management.persistence.UserPracticeSubmissionRepository;
import com.ieltsmastermind.practice.attempt.management.persistence.UserPracticeWritingAnswerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserPracticeWritingAnswerServiceImpl implements UserPracticeWritingAnswerService {

    private final UserPracticeSubmissionRepository submissionRepository;
    private final UserPracticeWritingAnswerRepository writingAnswerRepository;

    @Override
    @Transactional
    public UserPracticeWritingAnswerResponseDto create(
            UserPracticeWritingAnswerCreateRequestDto request
    ) {
        UserPracticeSubmission submission = submissionRepository
                .findById(request.getUserPracticeSubmissionId())
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        UserPracticeWritingAnswer writingAnswer = new UserPracticeWritingAnswer();
        writingAnswer.setSubmission(submission);
        writingAnswer.setOrderIndex(request.getOrderIndex());
        writingAnswer.setEssayText(request.getEssayText());
        writingAnswer.setWordCount(countWords(request.getEssayText()));

        UserPracticeWritingAnswer saved = writingAnswerRepository.save(writingAnswer);

        UserPracticeWritingAnswerResponseDto responseDto =
                new UserPracticeWritingAnswerResponseDto();
        responseDto.setId(saved.getId());
        responseDto.setSubmissionId(submission.getId());
        responseDto.setOrderIndex(saved.getOrderIndex());
        responseDto.setEssayText(saved.getEssayText());

        return responseDto;
    }

    private int countWords(String essayText) {
        if (essayText == null || essayText.trim().isEmpty()) {
            return 0;
        }
        return essayText.trim().split("\\s+").length;
    }
}
