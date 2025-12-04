package com.ieltsmastermind.practice.content.management.business.service;

import com.ieltsmastermind.practice.content.management.domain.dto.PracticeContentCreateRequestDto;
import com.ieltsmastermind.practice.content.management.domain.dto.PracticeContentResponseDto;
import com.ieltsmastermind.practice.content.management.domain.entity.PracticeAnswer;
import com.ieltsmastermind.practice.content.management.domain.entity.PracticeContent;
import com.ieltsmastermind.practice.content.management.domain.entity.PracticeQuestion;
import com.ieltsmastermind.practice.content.management.domain.enums.PracticeContentStatus;
import com.ieltsmastermind.practice.content.management.persistence.PracticeAnswerRepository;
import com.ieltsmastermind.practice.content.management.persistence.PracticeContentRepository;
import com.ieltsmastermind.practice.content.management.persistence.PracticeQuestionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
public class PracticeContentServiceImpl implements com.ieltsmastermind.practice.content.management.business.PracticeContentService {

    private final PracticeContentRepository practiceContentRepository;
    private final PracticeQuestionRepository practiceQuestionRepository;
    private final PracticeAnswerRepository practiceAnswerRepository;

    public PracticeContentServiceImpl(PracticeContentRepository practiceContentRepository,
                                      PracticeQuestionRepository practiceQuestionRepository,
                                      PracticeAnswerRepository practiceAnswerRepository) {
        this.practiceContentRepository = practiceContentRepository;
        this.practiceQuestionRepository = practiceQuestionRepository;
        this.practiceAnswerRepository = practiceAnswerRepository;
    }

    @Override
    @Transactional
    public PracticeContentResponseDto create(PracticeContentCreateRequestDto request) {
        PracticeContent content = new PracticeContent();
        content.setSkill(request.getSkill());
        content.setTitle(request.getTitle());
        content.setInstructions(request.getInstructions());
        content.setTask(request.getTask());

        // handle null sets safely
        content.setQuestionTypeTags(
                request.getQuestionTypeTags() != null
                        ? new HashSet<>(request.getQuestionTypeTags())
                        : new HashSet<>()
        );
        content.setTopicTags(
                request.getTopicTags() != null
                        ? new HashSet<>(request.getTopicTags())
                        : new HashSet<>()
        );

        content.setThumbnailUrl(request.getThumbnailUrl());
        content.setAudioUrl(request.getAudioUrl());
        content.setDurationMinutes(request.getDurationMinutes());
        content.setQuestionCount(request.getQuestionCount());

        LocalDateTime now = LocalDateTime.now();
        content.setCreatedOn(now);
        content.setUpdatedOn(now);

        content.setStatus(PracticeContentStatus.DRAFT);

        PracticeContent savedContent = practiceContentRepository.save(content);

        // We’ll build response DTOs while we create & save questions/answers
        PracticeContentResponseDto responseDto = new PracticeContentResponseDto();
        responseDto.setId(savedContent.getId());
        responseDto.setSkill(savedContent.getSkill());
        responseDto.setTitle(savedContent.getTitle());
        responseDto.setInstructions(savedContent.getInstructions());
        responseDto.setTask(savedContent.getTask());
        responseDto.setQuestionTypeTags(savedContent.getQuestionTypeTags());
        responseDto.setTopicTags(savedContent.getTopicTags());
        responseDto.setThumbnailUrl(savedContent.getThumbnailUrl());
        responseDto.setAudioUrl(savedContent.getAudioUrl());
        responseDto.setDurationMinutes(savedContent.getDurationMinutes());
        responseDto.setQuestionCount(savedContent.getQuestionCount());
        responseDto.setCreatedOn(savedContent.getCreatedOn());
        responseDto.setUpdatedOn(savedContent.getUpdatedOn());
        responseDto.setStatus(savedContent.getStatus());

        List<PracticeContentResponseDto.PracticeQuestionResponseDto> questionResponseDtos = new ArrayList<>();

        if (request.getQuestions() != null) {
            for (PracticeContentCreateRequestDto.PracticeQuestionCreateRequestDto qDto : request.getQuestions()) {

                PracticeQuestion question = new PracticeQuestion();
                question.setPracticeContent(savedContent);
                question.setOrderIndex(qDto.getOrderIndex());
                question.setType(qDto.getType());
                question.setExplanation(qDto.getExplanation());
                question.setShuffleOptions(qDto.getShuffleOptions());

                PracticeQuestion savedQuestion = practiceQuestionRepository.save(question);

                // Build question response DTO
                PracticeContentResponseDto.PracticeQuestionResponseDto questionResponseDto =
                        new PracticeContentResponseDto.PracticeQuestionResponseDto();
                questionResponseDto.setId(savedQuestion.getId());
                questionResponseDto.setOrderIndex(savedQuestion.getOrderIndex());
                questionResponseDto.setType(savedQuestion.getType());
                questionResponseDto.setExplanation(savedQuestion.getExplanation());
                questionResponseDto.setShuffleOptions(savedQuestion.getShuffleOptions());

                List<PracticeContentResponseDto.PracticeAnswerResponseDto> answerResponseDtos = new ArrayList<>();

                if (qDto.getAnswers() != null) {
                    for (PracticeContentCreateRequestDto.PracticeAnswerCreateRequestDto aDto : qDto.getAnswers()) {

                        PracticeAnswer answer = new PracticeAnswer();
                        answer.setQuestion(savedQuestion);
                        answer.setOrderIndex(aDto.getOrderIndex());
                        answer.setDisplayText(aDto.getDisplayText());
                        // avoid NPE: treat null as false
                        answer.setIsCorrect(Boolean.TRUE.equals(aDto.getIsCorrect()));
                        answer.setValue(aDto.getValue());

                        PracticeAnswer savedAnswer = practiceAnswerRepository.save(answer);

                        PracticeContentResponseDto.PracticeAnswerResponseDto answerResponseDto =
                                new PracticeContentResponseDto.PracticeAnswerResponseDto();
                        answerResponseDto.setId(savedAnswer.getId());
                        answerResponseDto.setOrderIndex(savedAnswer.getOrderIndex());
                        answerResponseDto.setDisplayText(savedAnswer.getDisplayText());
                        answerResponseDto.setIsCorrect(savedAnswer.getIsCorrect());
                        answerResponseDto.setValue(savedAnswer.getValue());

                        answerResponseDtos.add(answerResponseDto);
                    }
                }

                questionResponseDto.setAnswers(answerResponseDtos);
                questionResponseDtos.add(questionResponseDto);
            }
        }

        responseDto.setQuestions(questionResponseDtos);

        return responseDto;
    }
}
