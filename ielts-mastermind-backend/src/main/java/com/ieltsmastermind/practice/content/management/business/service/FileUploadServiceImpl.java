package com.ieltsmastermind.practice.content.management.business.service;

import com.ieltsmastermind.practice.content.management.business.interfaces.FileUploadService;
import com.ieltsmastermind.practice.content.management.domain.entity.PracticeContent;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileUploadServiceImpl implements FileUploadService {

    private static final String THUMBNAIL_UPLOAD_DIR = "uploads/thumbnails";
    private static final String AUDIO_UPLOAD_DIR = "uploads/audio";

    // 25 MB
    private static final long MAX_FILE_SIZE_BYTES = 25L * 1024 * 1024;

    @Override
    public String uploadThumbnail(MultipartFile file) {
        validateFile(file);

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Invalid file type for thumbnail. Only images are allowed.");
        }

        return storeFile(file, THUMBNAIL_UPLOAD_DIR, "/files/thumbnails/");
    }

    @Override
    public String uploadAudio(MultipartFile file) {
        validateFile(file);

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("audio/mpeg") && !contentType.equals("audio/wav"))) {
            // adjust types as needed
            throw new RuntimeException("Invalid file type for audio. Only mp3/wav are allowed.");
        }

        return storeFile(file, AUDIO_UPLOAD_DIR, "/files/audio/");
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Empty file");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new RuntimeException("File too large (max 25MB)");
        }
    }

    private String storeFile(MultipartFile file, String uploadDir, String publicBasePath) {
        try {
            String originalName = file.getOriginalFilename();
            String safeName = (originalName != null ? originalName.replaceAll("\\s+", "_") : "file");
            String filename = UUID.randomUUID() + "-" + safeName;

            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);

            Path target = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            return publicBasePath + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}
