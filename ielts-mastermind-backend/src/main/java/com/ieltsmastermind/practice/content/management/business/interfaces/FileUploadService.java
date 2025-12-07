package com.ieltsmastermind.practice.content.management.business.interfaces;


import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {

    String uploadThumbnail(MultipartFile file);

    String uploadAudio(MultipartFile file);

    void cleanupOldThumbnail(String oldUrl);

    void cleanupOldAudio(String oldUrl);
}
