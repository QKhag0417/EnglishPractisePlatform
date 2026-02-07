package com.ieltsmastermind.practice.content.management.controller;

import com.ieltsmastermind.common.response.ApiResponse;

import com.ieltsmastermind.practice.content.management.business.interfaces.PracticeContentService;
import com.ieltsmastermind.practice.content.management.domain.dto.PracticeContentCreateRequestDto;
import com.ieltsmastermind.practice.content.management.domain.dto.PracticeContentInstructionResponseDto;
import com.ieltsmastermind.practice.content.management.domain.dto.PracticeContentResponseDto;
import com.ieltsmastermind.practice.content.management.domain.dto.PracticeContentUpdateRequestDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/practice-content")
public class PracticeContentManagementController {

    private final PracticeContentService practiceContentService;

    public PracticeContentManagementController(PracticeContentService practiceContentService) {
        this.practiceContentService = practiceContentService;
    }

    @PreAuthorize("hasRole('Administrator')")
    @PostMapping
    public ResponseEntity<ApiResponse<PracticeContentResponseDto>> create(
            @Valid @RequestBody PracticeContentCreateRequestDto request
    ) {
        try {
            PracticeContentResponseDto created = practiceContentService.create(request);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Practice content created successfully", created));
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

    @GetMapping
    public ResponseEntity<ApiResponse<List<PracticeContentResponseDto>>> getAll() {
        try {
            List<PracticeContentResponseDto> contents = practiceContentService.getAll();
            return ResponseEntity.ok(
                    ApiResponse.success("Practice contents fetched successfully", contents)
            );
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

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PracticeContentResponseDto>> getById(
            @PathVariable String id
    ) {
        try {
            PracticeContentResponseDto content = practiceContentService.getById(id);
            return ResponseEntity.ok(
                    ApiResponse.success("Practice content fetched successfully", content)
            );
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

    @GetMapping("/{id}/instruction")
    public ResponseEntity<ApiResponse<PracticeContentInstructionResponseDto>> getInstructionByContentId(
            @PathVariable String id
    ) {
        try {
            PracticeContentInstructionResponseDto instruction = practiceContentService.getInstructionByContentId(id);
            return ResponseEntity.ok(
                    ApiResponse.success("Practice content instruction fetched successfully", instruction)
            );
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

    @PreAuthorize("hasRole('Administrator')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PracticeContentResponseDto>> update(
            @PathVariable String id,
            @Valid @RequestBody PracticeContentUpdateRequestDto request
    ) {
        try {
            PracticeContentResponseDto updated = practiceContentService.update(id, request);
            return ResponseEntity.ok(
                    ApiResponse.success("Practice content updated successfully", updated)
            );
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

    @PreAuthorize("hasRole('Administrator')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(
            @PathVariable String id
    ) {
        try {
            practiceContentService.delete(id);
            return ResponseEntity.ok(
                    ApiResponse.success("Practice content deleted successfully", null)
            );
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
