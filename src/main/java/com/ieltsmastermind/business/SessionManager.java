package com.ieltsmastermind.business;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionManager {

    private final Map<String, Session> sessions = new ConcurrentHashMap<>();

    public void addSession(String token, String userId, long expirationMillis) {
        sessions.put(token, new Session(userId, Instant.now().toEpochMilli() + expirationMillis));
    }

    public boolean isValid(String token) {
        Session session = sessions.get(token);
        if (session == null) return false;
        if (session.getExpireAt() < Instant.now().toEpochMilli()) {
            sessions.remove(token);
            return false;
        }
        return true;
    }

    public void removeSession(String token) {
        sessions.remove(token);
    }

    public static class Session {
        private String userId;
        private long expireAt;

        public Session(String userId, long expireAt) {
            this.userId = userId;
            this.expireAt = expireAt;
        }

        public String getUserId() {
            return userId;
        }

        public long getExpireAt() {
            return expireAt;
        }
    }
}