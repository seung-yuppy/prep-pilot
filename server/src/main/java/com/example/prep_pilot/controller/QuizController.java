package com.example.prep_pilot.controller;

import com.example.prep_pilot.dto.QuizRequestDto;
import com.example.prep_pilot.dto.QuizResponseDto;
import com.example.prep_pilot.dto.QuizResponseListDto;
import com.example.prep_pilot.service.QuizService;
import org.springframework.data.domain.Page;
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

    // 퀴즈 생성후 db 저장
    @PostMapping("/{postsId}/quiz")
    public ResponseEntity<QuizResponseListDto> createQuiz(@PathVariable Long postsId,
                                                          @RequestBody QuizRequestDto quizRequestDto){

        QuizResponseListDto list = quizService.createQuiz(postsId, quizRequestDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(list);
    }

    // 퀴즈 하나씩 가져오기
    @GetMapping("/{postId}/quiz")
    public ResponseEntity<Page<QuizResponseDto>> getQuiz(@PathVariable Long postId,
                                                        @RequestParam(defaultValue = "0") int page){

        int pageSize = 1;
        Page<QuizResponseDto> quizResponseDto = quizService.getQuiz(page, pageSize, postId);

        return ResponseEntity.status(HttpStatus.OK).body(quizResponseDto);
    }

    // 퀴즈
}
