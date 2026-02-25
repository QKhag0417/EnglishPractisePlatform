package com.ieltsmastermind.practice.attempt.management.persistence;

import com.ieltsmastermind.practice.attempt.management.domain.entity.UserPracticeSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserPracticeSubmissionRepository extends JpaRepository<UserPracticeSubmission, String> {

    List<UserPracticeSubmission> findAllByUserIdOrderBySubmittedAtDesc(String userId);
}
