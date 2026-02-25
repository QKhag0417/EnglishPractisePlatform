package com.ieltsmastermind.practice.attempt.management.business.service;

import com.ieltsmastermind.common.query.IncludeSpec;
import com.ieltsmastermind.practice.attempt.management.business.interfaces.UserPracticeSubmissionService;
import com.ieltsmastermind.practice.attempt.management.domain.dto.UserPracticeSubmissionCreateRequestDto;
import com.ieltsmastermind.practice.attempt.management.domain.dto.UserPracticeSubmissionResponseDto;
import com.ieltsmastermind.practice.attempt.management.domain.entity.UserPracticeSubmission;
import com.ieltsmastermind.practice.attempt.management.persistence.UserPracticeSubmissionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserPracticeSubmissionServiceImpl implements UserPracticeSubmissionService {

    private final UserPracticeSubmissionRepository userPracticeSubmissionRepository;

    public UserPracticeSubmissionServiceImpl(UserPracticeSubmissionRepository userPracticeSubmissionRepository) {
        this.userPracticeSubmissionRepository = userPracticeSubmissionRepository;
    }

    @Override
    @Transactional
    public UserPracticeSubmissionResponseDto create(UserPracticeSubmissionCreateRequestDto request) {

        UserPracticeSubmission submission = new UserPracticeSubmission();
        submission.setUserId(request.getUserId());
        submission.setPracticeContentId(request.getPracticeContentId());
        submission.setTimeSpentSeconds(request.getTimeSpentSeconds());
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setScore(request.getScore());

        UserPracticeSubmission saved = userPracticeSubmissionRepository.save(submission);

        UserPracticeSubmissionResponseDto responseDto = new UserPracticeSubmissionResponseDto();
        responseDto.setId(saved.getId());

        return responseDto;
    }

    @Override
    public List<UserPracticeSubmissionResponseDto> getAllByUserId(String userId, IncludeSpec includes) {
        List<UserPracticeSubmission> submissions =
                userPracticeSubmissionRepository.findAllByUserIdOrderBySubmittedAtDesc(userId);

        List<UserPracticeSubmissionResponseDto> result = new ArrayList<>();

        for (UserPracticeSubmission submission : submissions) {
            UserPracticeSubmissionResponseDto dto = new UserPracticeSubmissionResponseDto();
            dto.setId(submission.getId());
            applyIncludes(submission, dto, includes);
            result.add(dto);
        }

        return result;
    }

    @Override
    public UserPracticeSubmissionResponseDto getById(String id, IncludeSpec includes) {
        UserPracticeSubmission submission = userPracticeSubmissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        UserPracticeSubmissionResponseDto dto = new UserPracticeSubmissionResponseDto();
        dto.setId(submission.getId());
        applyIncludes(submission, dto, includes);

        return dto;
    }

    private void applyIncludes(UserPracticeSubmission submission,
                               UserPracticeSubmissionResponseDto dto,
                               IncludeSpec includes) {

        if (includes.has("userid")) dto.setUserId(submission.getUserId());
        if (includes.has("practicecontentid")) dto.setPracticeContentId(submission.getPracticeContentId());
        if (includes.has("timespentseconds")) dto.setTimeSpentSeconds(submission.getTimeSpentSeconds());
        if (includes.has("submittedat")) dto.setSubmittedAt(submission.getSubmittedAt());
        if (includes.has("score")) dto.setScore(submission.getScore());
    }
}
