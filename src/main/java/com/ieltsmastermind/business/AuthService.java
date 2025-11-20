package com.ieltsmastermind.business;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.ieltsmastermind.domain.dto.UserRegisterRequest;
import com.ieltsmastermind.domain.entities.User;
import com.ieltsmastermind.persistence.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private SessionManager sessionManager;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User register(UserRegisterRequest request) {
        // check email
        userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
            throw new RuntimeException("Email already exists");
        });

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setRole("Learner");


        return userRepository.save(user);
    }


    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Incorrect password");
        }

        String token = jwtUtils.generateToken(user.getUserId());
        sessionManager.addSession(token, user.getUserId(), jwtUtils.getExpirationMillis());
        return token;
    }
}
