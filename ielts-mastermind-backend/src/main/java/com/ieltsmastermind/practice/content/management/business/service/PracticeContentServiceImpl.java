package com.ieltsmastermind.practice.content.management.business.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ieltsmastermind.common.json.JsonConverter;
import com.ieltsmastermind.practice.content.management.business.interfaces.FileUploadService;
import com.ieltsmastermind.practice.content.management.business.interfaces.PracticeContentService;
import com.ieltsmastermind.practice.content.management.business.parser.InstructionParser;
import com.ieltsmastermind.practice.content.management.domain.dto.*;
import com.ieltsmastermind.practice.content.management.domain.entity.PracticeContent;
import com.ieltsmastermind.practice.content.management.domain.entity.PracticeQuestion;
import com.ieltsmastermind.practice.content.management.domain.model.doc.DocNode;
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
    private final InstructionParser instructionParser;
    private final JsonConverter jsonConverter;

    public PracticeContentServiceImpl(PracticeContentRepository practiceContentRepository,
                                      PracticeQuestionRepository practiceQuestionRepository,
                                      FileUploadService fileUploadService,
                                      InstructionParser instructionParser,
                                      JsonConverter jsonConverter) {
        this.practiceContentRepository = practiceContentRepository;
        this.practiceQuestionRepository = practiceQuestionRepository;
        this.fileUploadService = fileUploadService;
        this.instructionParser = instructionParser;
        this.jsonConverter = jsonConverter;
    }

    @Override
    @Transactional
    public PracticeContentResponseDto create(PracticeContentCreateRequestDto request) {
        PracticeContent content = new PracticeContent();
        content.setSkill(request.getSkill());
        content.setTitle(request.getTitle());
        content.setTask(request.getTask());

        content.setInstructions(request.getInstructions());
        List<DocNode> parsed = instructionParser.parseInstruction(request.getInstructions());
        JsonNode parsedJson = jsonConverter.toJsonNode(parsed);
        content.setInstructionsParsed(parsedJson);

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
                questionResponseDtos.add(mapQuestionToResponseDto(savedQuestion));
            }
        }

        PracticeContentResponseDto responseDto = mapContentToResponseDto(savedContent);
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
    public PracticeContentInstructionResponseDto getInstructionById(String id) {
        PracticeContent content = practiceContentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practice content not found with id: " + id));

        return mapInstructionToResponseDto(content);
    }

    @Override
    @Transactional
    public PracticeContentPromptResponseDto getPromptById(String id) {
        PracticeContent content = practiceContentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practice content not found with id: " + id));

        return mapContentToPromptResponseDto(content);
    }

    @Override
    @Transactional
    public PracticeContentAnswerResponseDto getAnswersById(String id) {

        PracticeContent content = practiceContentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practice content not found with id: " + id));

        List<PracticeQuestion> questions =
                practiceQuestionRepository.findByPracticeContentOrderByOrderIndexAsc(content);

        PracticeContentAnswerResponseDto dto = new PracticeContentAnswerResponseDto();
        dto.setId(content.getId());

        List<PracticeContentAnswerResponseDto.QuestionAnswerDto> answerDtos = new ArrayList<>();

        for (PracticeQuestion question : questions) {
            PracticeContentAnswerResponseDto.QuestionAnswerDto aDto =
                    new PracticeContentAnswerResponseDto.QuestionAnswerDto();

            aDto.setOrderIndex(question.getOrderIndex());

            aDto.setCorrectAnswers(question.getCorrectAnswers());

            answerDtos.add(aDto);
        }

        dto.setAnswers(answerDtos);
        return dto;
    }

    @Override
    public List<PracticeContentMetadataResponseDto> getAllMetadata() {
        List<PracticeContent> contents = practiceContentRepository.findAll();
        List<PracticeContentMetadataResponseDto> result = new ArrayList<>();

        for (PracticeContent content : contents) {
            PracticeContentMetadataResponseDto dto = mapContentToMetadataResponseDto(content);
            result.add(dto);
        }

        return result;
    }

    @Override
    public List<PracticeContentMetadataV2ResponseDto> getAllMetadataV2() {
        List<PracticeContent> contents = practiceContentRepository.findAll();
        List<PracticeContentMetadataV2ResponseDto> result = new ArrayList<>();

        for (PracticeContent content : contents) {
            PracticeContentMetadataV2ResponseDto dto = mapContentToMetadataV2ResponseDto(content);
            result.add(dto);
        }

        return result;
    }

    private PracticeContentMetadataV2ResponseDto mapContentToMetadataV2ResponseDto(PracticeContent content) {
        PracticeContentMetadataV2ResponseDto dto = new PracticeContentMetadataV2ResponseDto();
        dto.setId(content.getId());
        dto.setTitle(content.getTitle());
        dto.setSkill(content.getSkill());
        dto.setUpdatedOn(content.getUpdatedOn());

        dto.setQuestions(content.getQuestionCount());
        dto.setDuration(content.getDurationMinutes());

        dto.setAttempts(0L);

        dto.setStatus(content.getStatus());
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
        content.setTask(request.getTask());

        content.setInstructions(request.getInstructions());
        List<DocNode> parsed = instructionParser.parseInstruction(request.getInstructions());
        JsonNode parsedJson = jsonConverter.toJsonNode(parsed);
        content.setInstructionsParsed(parsedJson);

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

                questionResponseDtos.add(mapQuestionToResponseDto(savedQuestion));
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
        dto.setInstructionsParsed(content.getInstructionsParsed());
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

    private PracticeContentInstructionResponseDto mapInstructionToResponseDto(PracticeContent content) {
        PracticeContentInstructionResponseDto dto = new PracticeContentInstructionResponseDto();

        dto.setId(content.getId());
        dto.setTitle(content.getTitle());
        dto.setTimeInfo(content.getDurationMinutes());
        dto.setCandidateInstructions(content.getCandidateInstructions());
        dto.setCandidateInfo(content.getCandidateInfo());

        return dto;
    }

    private PracticeContentPromptResponseDto mapContentToPromptResponseDto(PracticeContent content) {
        PracticeContentPromptResponseDto dto = new PracticeContentPromptResponseDto();

        dto.setId(content.getId());
        dto.setTask(content.getTask());
        dto.setDuration(content.getDurationMinutes());
        dto.setAudioUrl(content.getAudioUrl());
        dto.setExamText(content.getInstructions());
        dto.setTotalQuestions(content.getQuestionCount());

        return dto;
    }

    private PracticeContentMetadataResponseDto mapContentToMetadataResponseDto(PracticeContent content) {
        PracticeContentMetadataResponseDto dto = new PracticeContentMetadataResponseDto();
        dto.setId(content.getId());
        dto.setTitle(content.getTitle());
        dto.setTask(content.getTask());
        dto.setQuestionTypeTags(content.getQuestionTypeTags());
        dto.setTopicTags(content.getTopicTags());
        dto.setThumbnailUrl(content.getThumbnailUrl());
        dto.setDurationMinutes(content.getDurationMinutes());
        dto.setQuestionCount(content.getQuestionCount());
        dto.setStatus(content.getStatus());
        dto.setUpdatedOn(content.getUpdatedOn());
        dto.setSkill(content.getSkill());

        // Not in PracticeContent entity -> return null (or set 0 if you prefer)
        dto.setAttempts(null);

        return dto;
    }
}
