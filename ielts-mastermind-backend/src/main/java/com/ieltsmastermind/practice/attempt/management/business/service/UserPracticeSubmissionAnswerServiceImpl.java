package com.ieltsmastermind.practice.attempt.management.business.service;

import com.ieltsmastermind.common.query.IncludeSpec;
import com.ieltsmastermind.practice.attempt.management.business.interfaces.UserPracticeSubmissionAnswerService;
import com.ieltsmastermind.practice.attempt.management.domain.dto.UserPracticeSubmissionAnswerBulkCreateRequestDto;
import com.ieltsmastermind.practice.attempt.management.domain.dto.UserPracticeSubmissionAnswerCreateRequestDto;
import com.ieltsmastermind.practice.attempt.management.domain.dto.UserPracticeSubmissionAnswerResponseDto;
import com.ieltsmastermind.practice.attempt.management.domain.entity.UserPracticeSubmission;
import com.ieltsmastermind.practice.attempt.management.domain.entity.UserPracticeSubmissionAnswer;
import com.ieltsmastermind.practice.attempt.management.domain.enums.Result;
import com.ieltsmastermind.practice.attempt.management.persistence.UserPracticeSubmissionAnswerRepository;
import com.ieltsmastermind.practice.attempt.management.persistence.UserPracticeSubmissionRepository;
import com.ieltsmastermind.practice.content.management.domain.entity.PracticeQuestion;
import com.ieltsmastermind.practice.content.management.persistence.PracticeQuestionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class UserPracticeSubmissionAnswerServiceImpl implements UserPracticeSubmissionAnswerService {

    private final UserPracticeSubmissionAnswerRepository answerRepository;
    private final UserPracticeSubmissionRepository submissionRepository;
    private final PracticeQuestionRepository practiceQuestionRepository;


    public UserPracticeSubmissionAnswerServiceImpl(
            UserPracticeSubmissionAnswerRepository answerRepository,
            UserPracticeSubmissionRepository submissionRepository,
            PracticeQuestionRepository practiceQuestionRepository
    ) {
        this.answerRepository = answerRepository;
        this.submissionRepository = submissionRepository;
        this.practiceQuestionRepository = practiceQuestionRepository;
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
    @Transactional
    public List<UserPracticeSubmissionAnswerResponseDto> createBulk(
            UserPracticeSubmissionAnswerBulkCreateRequestDto request
    ) {
        UserPracticeSubmission submission = submissionRepository
                .findById(request.getUserPracticeSubmissionId())
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        List<UserPracticeSubmissionAnswerCreateRequestDto> reqs = request.getAnswers();

        List<UserPracticeSubmissionAnswer> entities = new ArrayList<>(reqs.size());
        for (UserPracticeSubmissionAnswerCreateRequestDto r : reqs) {
            UserPracticeSubmissionAnswer answer = new UserPracticeSubmissionAnswer();
            answer.setSubmission(submission);
            answer.setOrderIndex(r.getOrderIndex());
            answer.setAnswers(new ArrayList<>(r.getAnswers()));
            entities.add(answer);
        }

        List<UserPracticeSubmissionAnswer> saved = answerRepository.saveAll(entities);

        calculateAndSetSubmissionResult(submission, saved);

        List<UserPracticeSubmissionAnswerResponseDto> response = new ArrayList<>(saved.size());
        for (UserPracticeSubmissionAnswer s : saved) {
            UserPracticeSubmissionAnswerResponseDto dto = new UserPracticeSubmissionAnswerResponseDto();
            dto.setId(s.getId());
            response.add(dto);
        }

        return response;
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
        if (includes.has("result")) dto.setResult(answer.getResult());

    }

    private void calculateAndSetSubmissionResult(UserPracticeSubmission submission,
                                               List<UserPracticeSubmissionAnswer> savedAnswers) {

        String practiceContentId = submission.getPracticeContentId();

        List<PracticeQuestion> questions =
                practiceQuestionRepository.findByPracticeContent_IdOrderByOrderIndexAsc(practiceContentId);

        Map<Integer, PracticeQuestion> questionByOrder = new HashMap<>();
        for (PracticeQuestion q : questions) {
            questionByOrder.put(q.getOrderIndex(), q);
        }

        Map<Integer, List<String>> userAnswersByOrder = new HashMap<>();
        for (UserPracticeSubmissionAnswer a : savedAnswers) {
            userAnswersByOrder.put(a.getOrderIndex(), a.getAnswers());

            PracticeQuestion q = questionByOrder.get(a.getOrderIndex());
            if (isAnswerEmpty(a.getAnswers())) {
                a.setResult(Result.SKIPPED);
            } else if (isCorrect(a.getAnswers(), q.getCorrectAnswers())) {
                a.setResult(Result.CORRECT);
            } else {
                a.setResult(Result.WRONG);
            }
        }

        int correct = 0;
        int wrong = 0;
        int skip = 0;

        for (PracticeQuestion q : questions) {
            List<String> userAns = userAnswersByOrder.get(q.getOrderIndex());

            if (isAnswerEmpty(userAns)) {
                skip++;
                continue;
            }

            if (isCorrect(userAns, q.getCorrectAnswers())) {
                correct++;
            } else {
                wrong++;
            }
        }

        submission.setCorrectAnswerCount(correct);
        submission.setWrongAnswerCount(wrong);
        submission.setSkipAnswerCount(skip);

        Double band = bandScoreFromRaw(correct);
        submission.setScore(band);
    }

    private boolean isAnswerEmpty(List<String> answers) {
        if (answers == null || answers.isEmpty()) return true;
        return answers.stream().allMatch(a -> a == null || a.trim().isEmpty());
    }

    private boolean isCorrect(List<String> userAnswers, List<String> correctAnswers) {
        Set<String> userSet = normalizeToSet(userAnswers);
        Set<String> correctSet = normalizeToSet(correctAnswers);

        if (userSet.isEmpty() || correctSet.isEmpty()) return false;

        if (userSet.size() == 1) {
            return correctSet.contains(userSet.iterator().next());
        }

        return userSet.equals(correctSet);
    }


    private Set<String> normalizeToSet(List<String> values) {
        if (values == null) return Set.of();
        Set<String> out = new HashSet<>();
        for (String v : values) {
            String n = normalize(v);
            if (!n.isBlank()) out.add(n);
        }
        return out;
    }

    private String normalize(String s) {
        if (s == null) return "";
        String x = s.trim().toLowerCase(Locale.ROOT).replaceAll("\\s+", " ");
        x = x.replaceAll("[\\p{Punct}]+$", "");
        return x;
    }

    private Double bandScoreFromRaw(int raw) {
        if (raw >= 39) return 9.0;
        if (raw >= 37) return 8.5;
        if (raw >= 35) return 8.0;
        if (raw >= 32) return 7.5;
        if (raw >= 30) return 7.0;
        if (raw >= 26) return 6.5;
        if (raw >= 23) return 6.0;
        if (raw >= 18) return 5.5;
        if (raw >= 16) return 5.0;
        if (raw >= 13) return 4.5;
        if (raw >= 11) return 4.0;
        if (raw >= 8)  return 3.5;
        if (raw >= 6)  return 3.0;
        if (raw >= 4)  return 2.5;
        if (raw >= 2)  return 2.0;
        if (raw >= 1)  return 1.5;
        return 0.0;
    }
}
