package com.ieltsmastermind.practice.content.management.persistence;

import com.ieltsmastermind.practice.content.management.domain.entity.PracticeAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PracticeAnswerRepository extends JpaRepository<PracticeAnswer, String> {}

