package com.ieltsmastermind.user.business;

import com.ieltsmastermind.authentication.business.JwtUtils;
import com.ieltsmastermind.user.domain.dto.HomePageResponseDto;
import com.ieltsmastermind.user.entities.User;
import com.ieltsmastermind.user.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    public HomePageResponseDto getHomeUserInfo(HttpServletRequest request) {

        String token = jwtUtils.getJwtFromCookie(request);
        if (token == null) {
            return new HomePageResponseDto(null, null, "guest", null);
        }

        String userId = jwtUtils.extractUserId(token);

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return new HomePageResponseDto(null, null, "guest", null);
        }

        return new HomePageResponseDto(
                user.getEmail(),
                user.getFirstname() + " " + user.getLastname(),
                user.getRole(),
                user.getAvatarUrl()
        );
    }
}