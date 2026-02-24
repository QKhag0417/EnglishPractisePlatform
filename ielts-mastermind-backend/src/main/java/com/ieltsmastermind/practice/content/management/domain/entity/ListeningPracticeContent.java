package com.ieltsmastermind.practice.content.management.domain.entity;

import com.ieltsmastermind.practice.content.management.domain.enums.PracticeContentSkill;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "practice_listening_content")
@PrimaryKeyJoinColumn(name = "practice_content_id")
public class ListeningPracticeContent extends PracticeContent {

    @Column(name = "audio_url", nullable = false)
    private String audioUrl;

    public ListeningPracticeContent() {
        super(PracticeContentSkill.LISTENING);
    }
}