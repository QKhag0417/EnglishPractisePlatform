package com.ieltsmastermind.practice.content.management.persistence;

import com.ieltsmastermind.practice.content.management.domain.entity.PracticeQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PracticeQuestionRepository extends JpaRepository<PracticeQuestion, String> {}

