package com.ieltsmastermind.practice.content.management.business.interfaces;


import com.ieltsmastermind.practice.content.management.domain.dto.FileDeleteRequestDto;
import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {

    String uploadThumbnail(MultipartFile file);

    String uploadAudio(MultipartFile file);

    String uploadAvatar(MultipartFile file);

    void deleteThumbnailByUrl(FileDeleteRequestDto request);

    void deleteAudioByUrl(FileDeleteRequestDto request);

    void deleteAvatarByUrl(FileDeleteRequestDto request);
}
