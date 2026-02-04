package com.ieltsmastermind.authentication.business;

import lombok.Getter;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionManager {
    private final StringRedisTemplate redisTemplate;

    public SessionManager(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void addSession(String token, String userId, String role, long expirationMillis) {
        String key = buildKey(token);

        Map<String, String> sessionData = new HashMap<>();
        sessionData.put("userId", userId);
        sessionData.put("role", role);
        sessionData.put("loginAt", String.valueOf(System.currentTimeMillis()));

        redisTemplate.opsForHash().putAll(key, sessionData);
        redisTemplate.expire(key, Duration.ofMillis(expirationMillis));
    }

    private String buildKey(String token) {
        return "session:" + token;
    }

    public boolean isValid(String token) {
        return redisTemplate.hasKey(buildKey(token));
    }


    public void removeSession(String token) {
        redisTemplate.delete(buildKey(token));
    }

    public void invalidateAllSessionsOfUser(String userId) {
        Set<String> keys = redisTemplate.keys("session:*");
        if (keys == null || keys.isEmpty()) return;

        for (String key : keys) {
            Object sessionUserId = redisTemplate.opsForHash().get(key, "userId");
            if (userId.equals(sessionUserId)) {
                redisTemplate.delete(key);
            }
        }
    }
    @Getter
    public static class Session {
        private final String userId;
        private final long expireAt;

        public Session(String userId, long expireAt) {
            this.userId = userId;
            this.expireAt = expireAt;
        }

    }
}