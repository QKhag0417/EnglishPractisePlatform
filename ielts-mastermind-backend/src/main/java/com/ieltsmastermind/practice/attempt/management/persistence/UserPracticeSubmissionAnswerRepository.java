package com.ieltsmastermind.practice.attempt.management.persistence;

import com.ieltsmastermind.practice.attempt.management.domain.entity.UserPracticeSubmission;
import com.ieltsmastermind.practice.attempt.management.domain.entity.UserPracticeSubmissionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPracticeSubmissionAnswerRepository extends JpaRepository<UserPracticeSubmissionAnswer, String> {
}
