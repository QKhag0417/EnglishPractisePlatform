package com.ieltsmastermind.user.management.controller;

import com.ieltsmastermind.common.response.ApiResponse;


import com.ieltsmastermind.user.management.business.UserService;
import com.ieltsmastermind.user.management.domain.dto.HomePageResponseDto;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomeController {

    private final UserService homeService;

    @GetMapping("")
    public ResponseEntity<ApiResponse<HomePageResponseDto>> getUserInfo(HttpServletRequest request) {
        HomePageResponseDto info = homeService.getHomeUserInfo(request);
        return ResponseEntity.ok(ApiResponse.success("HomePage Successful",info));
    }
}