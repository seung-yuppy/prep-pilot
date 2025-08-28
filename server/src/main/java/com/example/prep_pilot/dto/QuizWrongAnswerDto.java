package com.example.prep_pilot.dto;

import com.example.prep_pilot.entity.QuizWrongAnswer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.format.DateTimeFormatter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizWrongAnswerDto {

    private Long id;

    private String createdAt;

    private Boolean isCorrect;

    private String userAnswer;

    private Long quizId;

    private Long userId;

    public static QuizWrongAnswerDto toDto(QuizWrongAnswer quizWrongAnswer) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 M월 d일 H:m");

        return new QuizWrongAnswerDto(
                quizWrongAnswer.getId(),
                quizWrongAnswer.getCreatedAt().format(formatter),
                quizWrongAnswer.getIsCorrect(),
                quizWrongAnswer.getUserAnswer(),
                quizWrongAnswer.getQuiz().getId(),
                quizWrongAnswer.getUser().getId()
        );
    }
}
