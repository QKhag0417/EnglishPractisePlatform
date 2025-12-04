package com.ieltsmastermind.practice.content.management.persistence;

import com.ieltsmastermind.practice.content.management.domain.entity.PracticeContent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PracticeContentRepository extends JpaRepository<PracticeContent, String> {}

