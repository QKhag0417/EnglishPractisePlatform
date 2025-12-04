package com.ieltsmastermind.practice.content.management.persistence;

import com.ieltsmastermind.practice.content.management.domain.entity.PracticeAnswer;
import com.ieltsmastermind.practice.content.management.domain.entity.PracticeQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PracticeAnswerRepository extends JpaRepository<PracticeAnswer, String> {

    List<PracticeAnswer> findByQuestionOrderByOrderIndexAsc(PracticeQuestion question);
}

