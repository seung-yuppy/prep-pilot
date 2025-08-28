package com.example.prep_pilot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MyQuizDto {

    private String question;

    private String answer;

    private String userAnswer;

    private Boolean isCorrect;
}
