package com.ieltsmastermind.admin.controller;

import com.ieltsmastermind.authentication.business.UploadContentService;
import com.ieltsmastermind.common.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UploadContentService uploadContentService;

    @PostMapping("/upload")
    public ApiResponse<String> uploadContent() {
        String result = uploadContentService.uploadFake();
        return ApiResponse.success("Uploaded successfully", result);
    }
}
