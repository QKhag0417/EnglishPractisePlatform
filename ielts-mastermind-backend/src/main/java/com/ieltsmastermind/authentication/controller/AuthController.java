package com.ieltsmastermind.authentication.controller;

import com.ieltsmastermind.authentication.business.AuthService;
import com.ieltsmastermind.authentication.business.JwtUtils;
import com.ieltsmastermind.authentication.domain.dto.UserLoginRequestDto;
import com.ieltsmastermind.authentication.domain.dto.UserLoginResponseDto;
import com.ieltsmastermind.authentication.domain.dto.UserRegisterRequestDto;
import com.ieltsmastermind.authentication.domain.dto.UserRegisterResponseDto;
import com.ieltsmastermind.common.response.ApiResponse;
import com.ieltsmastermind.user.management.domain.entity.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private JwtUtils jwtUtils;

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserRegisterResponseDto>> register(
            @Valid @RequestBody UserRegisterRequestDto request) {
        try {
            UserRegisterResponseDto responseDto = authService.register(request);
            return ResponseEntity.ok(ApiResponse.success("User registered successfully", responseDto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("Internal server error"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserLoginResponseDto>> login(
            @Valid @RequestBody UserLoginRequestDto request,
            HttpServletResponse response
    ) {
        try {
            String token = authService.login(request.getEmail(), request.getPassword());

            int maxAgeSeconds = (int) (jwtUtils.getExpirationMillis() / 1000);
            jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("jwt", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge(maxAgeSeconds);
            response.addCookie(cookie);

            String role = jwtUtils.getRoleFromToken(token);
            String userId = jwtUtils.getUserIdFromToken(token);
            UserLoginResponseDto dto = new UserLoginResponseDto(userId, role);

            return ResponseEntity.ok(ApiResponse.success("Login successful", dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(
            @CookieValue(value = "jwt", required = false) String jwtCookie,
            HttpServletResponse response
    ) {
        try {
            if (jwtCookie != null) {
                authService.logout(jwtCookie);
            }

            jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("jwt", null);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge(0); // xóa cookie
            response.addCookie(cookie);

            return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error"));
        }
    }
}