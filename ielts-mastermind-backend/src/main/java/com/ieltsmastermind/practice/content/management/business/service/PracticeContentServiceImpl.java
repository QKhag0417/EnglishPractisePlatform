package com.ieltsmastermind.practice.content.management.business.service;

import com.ieltsmastermind.practice.content.management.business.interfaces.FileUploadService;
import com.ieltsmastermind.practice.content.management.business.interfaces.PracticeContentService;
import com.ieltsmastermind.practice.content.management.domain.dto.PracticeContentCreateRequestDto;
import com.ieltsmastermind.practice.content.management.domain.dto.PracticeContentResponseDto;
import com.ieltsmastermind.practice.content.management.domain.dto.PracticeContentUpdateRequestDto;
import com.ieltsmastermind.practice.content.management.domain.entity.PracticeContent;
import com.ieltsmastermind.practice.content.management.domain.entity.PracticeQuestion;
import com.ieltsmastermind.practice.content.management.persistence.PracticeContentRepository;
import com.ieltsmastermind.practice.content.management.persistence.PracticeQuestionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
public class PracticeContentServiceImpl implements PracticeContentService {

    private final PracticeContentRepository practiceContentRepository;
    private final PracticeQuestionRepository practiceQuestionRepository;
    private final FileUploadService fileUploadService;

    public PracticeContentServiceImpl(PracticeContentRepository practiceContentRepository,
                                      PracticeQuestionRepository practiceQuestionRepository,
                                      FileUploadService fileUploadService) {
        this.practiceContentRepository = practiceContentRepository;
        this.practiceQuestionRepository = practiceQuestionRepository;
        this.fileUploadService = fileUploadService;
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

        content.setStatus(request.getStatus());

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

                question.setCorrectAnswers(
                        qDto.getCorrectAnswers() != null
                                ? new ArrayList<>(qDto.getCorrectAnswers())
                                : new ArrayList<>()
                );

                PracticeQuestion savedQuestion = practiceQuestionRepository.save(question);

                // Build question response DTO
                PracticeContentResponseDto.PracticeQuestionResponseDto questionResponseDto =
                        new PracticeContentResponseDto.PracticeQuestionResponseDto();
                questionResponseDto.setId(savedQuestion.getId());
                questionResponseDto.setOrderIndex(savedQuestion.getOrderIndex());
                questionResponseDto.setType(savedQuestion.getType());

                questionResponseDto.setCorrectAnswers(
                        savedQuestion.getCorrectAnswers() != null
                                ? new ArrayList<>(savedQuestion.getCorrectAnswers())
                                : new ArrayList<>()
                );

                questionResponseDtos.add(questionResponseDto);
            }
        }

        responseDto.setQuestions(questionResponseDtos);

        return responseDto;
    }

    @Override
    @Transactional
    public List<PracticeContentResponseDto> getAll() {
        List<PracticeContent> contents = practiceContentRepository.findAll();
        List<PracticeContentResponseDto> result = new ArrayList<>();

        for (PracticeContent content : contents) {
            PracticeContentResponseDto dto = mapContentToResponseDto(content);

            // Fetch questions for this content
            List<PracticeQuestion> questions =
                    practiceQuestionRepository.findByPracticeContentOrderByOrderIndexAsc(content);

            List<PracticeContentResponseDto.PracticeQuestionResponseDto> questionDtos = new ArrayList<>();

            for (PracticeQuestion question : questions) {
                PracticeContentResponseDto.PracticeQuestionResponseDto qDto =
                        mapQuestionToResponseDto(question);

                questionDtos.add(qDto);
            }

            dto.setQuestions(questionDtos);
            result.add(dto);
        }

        return result;
    }

    @Override
    @Transactional
    public PracticeContentResponseDto getById(String id) {
        PracticeContent content = practiceContentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practice content not found with id: " + id));

        // Map content -> DTO
        PracticeContentResponseDto dto = mapContentToResponseDto(content);

        // Fetch questions for this content
        List<PracticeQuestion> questions =
                practiceQuestionRepository.findByPracticeContentOrderByOrderIndexAsc(content);

        List<PracticeContentResponseDto.PracticeQuestionResponseDto> questionDtos = new ArrayList<>();

        for (PracticeQuestion question : questions) {
            PracticeContentResponseDto.PracticeQuestionResponseDto qDto =
                    mapQuestionToResponseDto(question);

            questionDtos.add(qDto);
        }

        dto.setQuestions(questionDtos);

        return dto;
    }

    @Override
    @Transactional
    public PracticeContentResponseDto update(String id, PracticeContentUpdateRequestDto request) {
        PracticeContent content = practiceContentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practice content not found with id: " + id));

        String oldThumbnailUrl = content.getThumbnailUrl();
        String oldAudioUrl = content.getAudioUrl();

        content.setSkill(request.getSkill());
        content.setTitle(request.getTitle());
        content.setInstructions(request.getInstructions());
        content.setTask(request.getTask());

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
        content.setUpdatedOn(LocalDateTime.now());
        content.setStatus(request.getStatus());

        // Remove existing questions + answers
        List<PracticeQuestion> existingQuestions =
                practiceQuestionRepository.findByPracticeContentOrderByOrderIndexAsc(content);

        practiceQuestionRepository.deleteAll(existingQuestions);

        // Recreate questions + answers from request
        List<PracticeContentResponseDto.PracticeQuestionResponseDto> questionResponseDtos = new ArrayList<>();

        if (request.getQuestions() != null) {
            for (PracticeContentUpdateRequestDto.PracticeQuestionUpdateRequestDto qDto : request.getQuestions()) {

                PracticeQuestion question = new PracticeQuestion();
                question.setPracticeContent(content);
                question.setOrderIndex(qDto.getOrderIndex());
                question.setType(qDto.getType());

                question.setCorrectAnswers(
                        qDto.getCorrectAnswers() != null
                                ? new ArrayList<>(qDto.getCorrectAnswers())
                                : new ArrayList<>()
                );

                PracticeQuestion savedQuestion = practiceQuestionRepository.save(question);

                PracticeContentResponseDto.PracticeQuestionResponseDto questionResponseDto =
                        new PracticeContentResponseDto.PracticeQuestionResponseDto();
                questionResponseDto.setId(savedQuestion.getId());
                questionResponseDto.setOrderIndex(savedQuestion.getOrderIndex());
                questionResponseDto.setType(savedQuestion.getType());

                questionResponseDto.setCorrectAnswers(
                        savedQuestion.getCorrectAnswers() != null
                                ? new ArrayList<>(savedQuestion.getCorrectAnswers())
                                : new ArrayList<>()
                );

                questionResponseDtos.add(questionResponseDto);
            }
        }

        PracticeContent savedContent = practiceContentRepository.save(content);

        fileUploadService.cleanupOldThumbnail(oldThumbnailUrl);
        fileUploadService.cleanupOldAudio(oldAudioUrl);

        PracticeContentResponseDto responseDto = mapContentToResponseDto(savedContent);
        responseDto.setQuestions(questionResponseDtos);

        return responseDto;
    }

    @Override
    @Transactional
    public void delete(String id) {
        PracticeContent content = practiceContentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practice content not found with id: " + id));

        String oldThumbnailUrl = content.getThumbnailUrl();
        String oldAudioUrl = content.getAudioUrl();

        List<PracticeQuestion> questions =
                practiceQuestionRepository.findByPracticeContentOrderByOrderIndexAsc(content);

        practiceQuestionRepository.deleteAll(questions);

        practiceContentRepository.delete(content);

        fileUploadService.cleanupOldThumbnail(oldThumbnailUrl);
        fileUploadService.cleanupOldAudio(oldAudioUrl);
    }

    private PracticeContentResponseDto mapContentToResponseDto(PracticeContent content) {
        PracticeContentResponseDto dto = new PracticeContentResponseDto();
        dto.setId(content.getId());
        dto.setSkill(content.getSkill());
        dto.setTitle(content.getTitle());
        dto.setInstructions(content.getInstructions());
        dto.setTask(content.getTask());
        dto.setQuestionTypeTags(
                content.getQuestionTypeTags() != null
                        ? new HashSet<>(content.getQuestionTypeTags())
                        : new HashSet<>()
        );
        dto.setTopicTags(
                content.getTopicTags() != null
                        ? new HashSet<>(content.getTopicTags())
                        : new HashSet<>()
        );
        dto.setThumbnailUrl(content.getThumbnailUrl());
        dto.setAudioUrl(content.getAudioUrl());
        dto.setDurationMinutes(content.getDurationMinutes());
        dto.setQuestionCount(content.getQuestionCount());
        dto.setCreatedOn(content.getCreatedOn());
        dto.setUpdatedOn(content.getUpdatedOn());
        dto.setStatus(content.getStatus());
        return dto;
    }

    private PracticeContentResponseDto.PracticeQuestionResponseDto mapQuestionToResponseDto(
            PracticeQuestion question
    ) {
        PracticeContentResponseDto.PracticeQuestionResponseDto dto =
                new PracticeContentResponseDto.PracticeQuestionResponseDto();
        dto.setId(question.getId());
        dto.setOrderIndex(question.getOrderIndex());
        dto.setType(question.getType());
        dto.setCorrectAnswers(
                question.getCorrectAnswers() != null
                        ? new ArrayList<>(question.getCorrectAnswers())
                        : new ArrayList<>()
        );

        return dto;
    }
}
