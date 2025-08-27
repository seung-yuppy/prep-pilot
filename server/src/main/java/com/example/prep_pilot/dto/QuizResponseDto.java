package com.example.prep_pilot.dto;

import com.example.prep_pilot.entity.Quiz;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizResponseDto {

    private String question;

    private String answer;

    public static QuizResponseDto toDto(Quiz quiz) {

        return new QuizResponseDto(
                quiz.getQuestion(),
                quiz.getAnswer()
        );
    }
}
