package com.ieltsmastermind.practice.attempt.management.persistence;

import com.ieltsmastermind.practice.attempt.management.domain.entity.UserPracticeWritingAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPracticeWritingAnswerRepository
        extends JpaRepository<UserPracticeWritingAnswer, String> {
}
