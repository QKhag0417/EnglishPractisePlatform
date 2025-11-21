package com.ieltsmastermind.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())   // Tắt CSRF vì đang dùng API

                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )

                .httpBasic(httpBasic -> httpBasic.disable());   // Tắt basic auth luôn

        return http.build();
    }
}