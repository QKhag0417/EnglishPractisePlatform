package com.ieltsmastermind.practice.attempt.management.business.service;

import com.ieltsmastermind.common.query.IncludeSpec;
import com.ieltsmastermind.practice.attempt.management.business.interfaces.UserPracticeSubmissionAnswerService;
import com.ieltsmastermind.practice.attempt.management.domain.dto.UserPracticeSubmissionAnswerCreateRequestDto;
import com.ieltsmastermind.practice.attempt.management.domain.dto.UserPracticeSubmissionAnswerResponseDto;
import com.ieltsmastermind.practice.attempt.management.domain.entity.UserPracticeSubmission;
import com.ieltsmastermind.practice.attempt.management.domain.entity.UserPracticeSubmissionAnswer;
import com.ieltsmastermind.practice.attempt.management.persistence.UserPracticeSubmissionAnswerRepository;
import com.ieltsmastermind.practice.attempt.management.persistence.UserPracticeSubmissionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserPracticeSubmissionAnswerServiceImpl implements UserPracticeSubmissionAnswerService {

    private final UserPracticeSubmissionAnswerRepository answerRepository;
    private final UserPracticeSubmissionRepository submissionRepository;

    public UserPracticeSubmissionAnswerServiceImpl(
            UserPracticeSubmissionAnswerRepository answerRepository,
            UserPracticeSubmissionRepository submissionRepository
    ) {
        this.answerRepository = answerRepository;
        this.submissionRepository = submissionRepository;
    }

    @Override
    @Transactional
    public UserPracticeSubmissionAnswerResponseDto create(UserPracticeSubmissionAnswerCreateRequestDto request) {

        UserPracticeSubmission submission = submissionRepository
                .findById(request.getUserPracticeSubmissionId())
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        UserPracticeSubmissionAnswer answer = new UserPracticeSubmissionAnswer();
        answer.setSubmission(submission);
        answer.setOrderIndex(request.getOrderIndex());
        answer.setAnswers(new ArrayList<>(request.getAnswers()));

        UserPracticeSubmissionAnswer saved = answerRepository.save(answer);

        UserPracticeSubmissionAnswerResponseDto responseDto = new UserPracticeSubmissionAnswerResponseDto();
        responseDto.setId(saved.getId());
        return responseDto;
    }

    @Override
    public List<UserPracticeSubmissionAnswerResponseDto> getAllBySubmissionId(String submissionId, IncludeSpec includes) {
        List<UserPracticeSubmissionAnswer> answerRows =
                answerRepository.findAllBySubmission_IdOrderByOrderIndexAsc(submissionId);

        List<UserPracticeSubmissionAnswerResponseDto> result = new ArrayList<>();

        for (UserPracticeSubmissionAnswer row : answerRows) {
            UserPracticeSubmissionAnswerResponseDto dto = new UserPracticeSubmissionAnswerResponseDto();
            dto.setId(row.getId());
            applyIncludes(row, dto, includes);

            result.add(dto);
        }

        return result;
    }

    @Override
    public UserPracticeSubmissionAnswerResponseDto getById(String id, IncludeSpec includes) {

        UserPracticeSubmissionAnswer answer = answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission answer not found"));

        UserPracticeSubmissionAnswerResponseDto dto = new UserPracticeSubmissionAnswerResponseDto();
        dto.setId(answer.getId());
        applyIncludes(answer, dto, includes);

        return dto;
    }

    private void applyIncludes(UserPracticeSubmissionAnswer answer,
                               UserPracticeSubmissionAnswerResponseDto dto,
                               IncludeSpec includes) {

        if (includes.has("submissionid")) dto.setSubmissionId(answer.getSubmission().getId());
        if (includes.has("orderindex")) dto.setOrderIndex(answer.getOrderIndex());
        if (includes.has("answers")) dto.setAnswers(new ArrayList<>(answer.getAnswers()));
    }
}
