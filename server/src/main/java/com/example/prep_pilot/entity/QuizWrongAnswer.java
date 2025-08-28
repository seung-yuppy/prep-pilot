package com.example.prep_pilot.entity;

import com.example.prep_pilot.dto.QuizWrongAnswerDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizWrongAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_answer")
    private String userAnswer;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public static QuizWrongAnswer toEntity(User user, Quiz quiz, QuizWrongAnswerDto dto) {

        return new QuizWrongAnswer(
                null,
                dto.getUserAnswer(),
                dto.getIsCorrect(),
                LocalDateTime.now(),
                quiz,
                user
        );
    }
}
