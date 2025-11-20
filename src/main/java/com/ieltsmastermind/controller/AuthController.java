package com.ieltsmastermind.controller;


import com.ieltsmastermind.business.AuthService;
import com.ieltsmastermind.business.JwtUtils;
import com.ieltsmastermind.domain.dto.UserLoginRequest;
import com.ieltsmastermind.domain.dto.UserRegisterRequest;
import com.ieltsmastermind.domain.entities.User;
import com.ieltsmastermind.domain.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import java.util.Map;

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
    public ResponseEntity<ApiResponse<User>> register(@RequestBody UserRegisterRequest request) {
        try {
            User registeredUser = authService.register(request);
            registeredUser.setPasswordHash(null);
            return ResponseEntity.ok(ApiResponse.success("User registered successfully", registeredUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(
            @RequestBody UserLoginRequest request,
            HttpServletResponse response
    ) {
        try {
            String token = authService.login(request.getEmail(), request.getPassword());
            // Tạo cookie chứa JWT
            int maxAgeSeconds = (int) (jwtUtils.getExpirationMillis() / 1000);
            jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("jwt", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge(maxAgeSeconds);
            response.addCookie(cookie);


            return ResponseEntity.ok(ApiResponse.success("Login successful", token));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error"));
        }
    }
}