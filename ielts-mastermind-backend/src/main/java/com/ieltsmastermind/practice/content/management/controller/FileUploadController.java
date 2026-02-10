package com.ieltsmastermind.practice.content.management.controller;

import com.ieltsmastermind.common.response.ApiResponse;
import com.ieltsmastermind.practice.content.management.business.interfaces.FileUploadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    public FileUploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    @PreAuthorize("hasRole('Administrator')")
    @PostMapping(value = "/thumbnail", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadThumbnail(@RequestParam("file") MultipartFile file) {
        try {
            String url = fileUploadService.uploadThumbnail(file);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Thumbnail uploaded successfully", url));
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
    @PostMapping(value = "/audio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadAudio(@RequestParam("file") MultipartFile file) {
        try {
            String url = fileUploadService.uploadAudio(file);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Audio uploaded successfully", url));
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
    @DeleteMapping("/thumbnail")
    public ResponseEntity<ApiResponse<Void>> deleteThumbnail(@RequestParam("thumbnailUrl") String thumbnailUrl) {
        try {
            fileUploadService.deleteThumbnailByUrl(thumbnailUrl);
            return ResponseEntity.ok(ApiResponse.success("Thumbnail deleted successfully", null));
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
    @DeleteMapping("/audio")
    public ResponseEntity<ApiResponse<Void>> deleteAudio(
            @RequestParam("audioUrl") String audioUrl
    ) {
        try {
            fileUploadService.deleteAudioByUrl(audioUrl);
            return ResponseEntity.ok(
                    ApiResponse.success("Audio deleted successfully", null)
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