package com.example.prep_pilot.entity;

import com.example.prep_pilot.dto.QuizResponseDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String question;

    private String answer;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Posts posts;

    public static Quiz createQuiz(Posts posts, QuizResponseDto q) {
        return new Quiz(
                null,
                q.getQuestion(),
                q.getAnswer(),
                LocalDateTime.now(),
                posts
        );
    }
}
