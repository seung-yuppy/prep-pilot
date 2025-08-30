package com.example.prep_pilot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizStatDto {

    private Long totalQuizCount;

    private Long wrongQuizCount;
}
