package com.example.prep_pilot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizPostResponseDto {

    private Long postsId;

    private String title;

    private String createdAt;

    public QuizPostResponseDto(Long postsId, String title, LocalDateTime createdAt) {
        this.postsId = postsId;
        this.title = title;
        this.createdAt = createdAt.format(DateTimeFormatter.ofPattern("yyyy년 M월 d일"));
    }
}
