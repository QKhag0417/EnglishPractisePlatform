package com.ieltsmastermind.user.management.controller;

import com.ieltsmastermind.common.response.ApiResponse;
import com.ieltsmastermind.user.management.business.interfaces.UserService;
import com.ieltsmastermind.user.management.domain.dto.UserCreateRequestDto;
import com.ieltsmastermind.user.management.domain.dto.UserResponseDto;
import com.ieltsmastermind.user.management.domain.dto.UserUpdateRequestDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserManagementController {

    private final UserService userService;

    public UserManagementController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasRole('Administrator')")
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponseDto>> createUser(
            @Valid @RequestBody UserCreateRequestDto request
    ) {
        try {
            UserResponseDto created = userService.create(request);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.success("User created successfully", created));
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
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> getAllUsers() {
        try {
            List<UserResponseDto> users = userService.getAll();
            return ResponseEntity.ok(
                    ApiResponse.success("Users fetched successfully", users)
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
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserById(
            @PathVariable String id
    ) {
        try {
            UserResponseDto user = userService.getById(id);
            return ResponseEntity.ok(
                    ApiResponse.success("User fetched successfully", user)
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
    public ResponseEntity<ApiResponse<UserResponseDto>> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UserUpdateRequestDto request
    ) {
        try {
            UserResponseDto updated = userService.update(id, request);
            return ResponseEntity.ok(
                    ApiResponse.success("User updated successfully", updated)
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
    public ResponseEntity<ApiResponse<String>> deleteUser(
            @PathVariable String id
    ) {
        try {
            userService.delete(id);
            return ResponseEntity.ok(
                    ApiResponse.success("User deleted successfully", null)
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
