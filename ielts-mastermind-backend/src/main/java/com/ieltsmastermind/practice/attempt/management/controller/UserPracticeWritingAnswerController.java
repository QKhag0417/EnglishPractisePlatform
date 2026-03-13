package com.ieltsmastermind.practice.attempt.management.controller;

import com.ieltsmastermind.common.response.ApiResponse;
import com.ieltsmastermind.practice.attempt.management.business.interfaces.UserPracticeWritingAnswerService;
import com.ieltsmastermind.practice.attempt.management.domain.dto.UserPracticeWritingAnswerCreateRequestDto;
import com.ieltsmastermind.practice.attempt.management.domain.dto.UserPracticeWritingAnswerResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user-practice-writing-answer")
@RequiredArgsConstructor
public class UserPracticeWritingAnswerController {

    private final UserPracticeWritingAnswerService userPracticeWritingAnswerService;

    @PostMapping
    public ResponseEntity<ApiResponse<UserPracticeWritingAnswerResponseDto>> create(
            @Valid @RequestBody UserPracticeWritingAnswerCreateRequestDto request
    ) {
        try {
            UserPracticeWritingAnswerResponseDto created =
                    userPracticeWritingAnswerService.create(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Writing answer created successfully", created));

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse.fail(e.getMessage(), null));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error"));
        }
    }
}
