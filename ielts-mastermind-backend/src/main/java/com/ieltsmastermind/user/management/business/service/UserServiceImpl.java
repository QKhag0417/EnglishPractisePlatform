package com.ieltsmastermind.user.management.business.service;

import com.ieltsmastermind.user.management.business.interfaces.UserService;
import com.ieltsmastermind.user.management.domain.dto.UserCreateRequestDto;
import com.ieltsmastermind.user.management.domain.dto.UserResponseDto;
import com.ieltsmastermind.user.management.domain.dto.UserUpdateRequestDto;
import com.ieltsmastermind.user.management.domain.entity.User;
import com.ieltsmastermind.user.management.persistence.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UserResponseDto create(UserCreateRequestDto request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use: " + request.getEmail());
        }

        if (request.getPhone() != null &&
                userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone already in use: " + request.getPhone());
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setCountry(request.getCountry());
        user.setTimezone(request.getTimezone());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setTargetBand(request.getTargetBand());
        user.setExamDate(request.getExamDate());

        user.setRole(request.getRole());
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setLastLoginAt(null);

        User saved = userRepository.save(user);

        return mapToResponseDto(saved);
    }

    @Override
    @Transactional
    public List<UserResponseDto> getAll() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Override
    @Transactional
    public UserResponseDto getById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        return mapToResponseDto(user);
    }

    @Override
    @Transactional
    public UserResponseDto update(String id, UserUpdateRequestDto request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (request.getEmail() != null
                && !request.getEmail().equals(user.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use: " + request.getEmail());
        }

        if (request.getPhone() != null
                && !request.getPhone().equals(user.getPhone())
                && userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone already in use: " + request.getPhone());
        }

        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setCountry(request.getCountry());
        user.setTimezone(request.getTimezone());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setTargetBand(request.getTargetBand());
        user.setExamDate(request.getExamDate());
        user.setRole(request.getRole());
        user.setIsActive(request.getIsActive());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        User saved = userRepository.save(user);

        return mapToResponseDto(saved);
    }

    @Override
    @Transactional
    public void delete(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        userRepository.delete(user);
    }

    private UserResponseDto mapToResponseDto(User saved) {
        UserResponseDto dto = new UserResponseDto();
        dto.setUserId(saved.getUserId());
        dto.setEmail(saved.getEmail());
        dto.setPhone(saved.getPhone());
        dto.setIsActive(saved.getIsActive());
        dto.setCreatedAt(saved.getCreatedAt());
        dto.setLastLoginAt(saved.getLastLoginAt());
        dto.setRole(saved.getRole());
        dto.setFirstname(saved.getFirstname());
        dto.setLastname(saved.getLastname());
        dto.setCountry(saved.getCountry());
        dto.setTimezone(saved.getTimezone());
        dto.setAvatarUrl(saved.getAvatarUrl());
        dto.setTargetBand(saved.getTargetBand());
        dto.setExamDate(saved.getExamDate());
        return dto;
    }
}
