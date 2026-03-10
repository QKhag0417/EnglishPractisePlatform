package com.ieltsmastermind.practice.attempt.management.persistence;

import com.ieltsmastermind.practice.attempt.management.domain.entity.UserPracticeContentProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserPracticeContentProgressRepository
        extends JpaRepository<UserPracticeContentProgress, String> {

    Optional<UserPracticeContentProgress> findByUserIdAndPracticeContentId(
            String userId,
            String practiceContentId
    );

    List<UserPracticeContentProgress> findAllByUserId(String userId);
}
