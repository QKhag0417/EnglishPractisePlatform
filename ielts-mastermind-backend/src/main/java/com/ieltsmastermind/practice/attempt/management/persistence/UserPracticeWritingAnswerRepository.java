package com.ieltsmastermind.practice.attempt.management.persistence;

import com.ieltsmastermind.practice.attempt.management.domain.entity.UserPracticeWritingAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserPracticeWritingAnswerRepository
        extends JpaRepository<UserPracticeWritingAnswer, String> {

    List<UserPracticeWritingAnswer> findAllBySubmission_IdOrderByOrderIndexAsc(String submissionId);
}
