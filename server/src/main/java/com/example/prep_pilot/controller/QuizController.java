package com.example.prep_pilot.controller;

import com.example.prep_pilot.dto.QuizRequestDto;
import com.example.prep_pilot.dto.QuizResponseListDto;
import com.example.prep_pilot.service.QuizService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService){

        this.quizService = quizService;
    }

    // 퀴즈 생성
    @PostMapping("/{postsId}/quiz")
    public ResponseEntity<QuizResponseListDto> createQuiz(@PathVariable Long postsId,
                                                          @RequestBody QuizRequestDto quizRequestDto){

        QuizResponseListDto list = quizService.createQuiz(postsId, quizRequestDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(list);
    }
}
