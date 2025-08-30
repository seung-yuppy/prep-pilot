package com.example.prep_pilot.controller;

import com.example.prep_pilot.dto.*;
import com.example.prep_pilot.service.QuizService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService){

        this.quizService = quizService;
    }

    // ai 퀴즈 있는지 확인
    @GetMapping("/{postsId}/quiz/present")
    public ResponseEntity<Boolean> isPresentQuiz(@PathVariable Long postsId){

        Boolean isPresent = quizService.isPresentQuiz(postsId);

        return ResponseEntity.status(HttpStatus.OK).body(isPresent);
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

    // 푼 퀴즈 내 답과 함께 db에 등록
    @PostMapping("/quiz/{id}/save")
    public ResponseEntity<QuizWrongAnswerDto> saveMyQuiz(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                         @RequestBody QuizWrongAnswerDto dto,
                                                         @PathVariable Long id){

        String username = userDetails.getUsername();
        QuizWrongAnswerDto quizWrongAnswerDto = quizService.saveMyQuiz(username, dto, id);

        return ResponseEntity.status(HttpStatus.CREATED).body(quizWrongAnswerDto);
    }

    // 내가 푼 해당 포스트id 모든 문제들 가져오기
    @GetMapping("/{postsId}/quiz/solved")
    public ResponseEntity<List<MyQuizDto>> getAllMySolvedQuiz(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                              @PathVariable Long postsId){

        String username = userDetails.getUsername();
        List<MyQuizDto> list = quizService.getAllMySolvedQuiz(username, postsId);

        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    // 내가 푼 해당 포스트id 오답 문제들 가져오기
    @GetMapping("/{postsId}/quiz/wrong")
    public ResponseEntity<List<MyQuizDto>> getMyWrongQuiz(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                          @PathVariable Long postsId){

        String username = userDetails.getUsername();
        List<MyQuizDto> list = quizService.getMyWrongQuiz(username, postsId);

        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    // 내가 퀴즈 푼 이력이 있는 posts
    @GetMapping("quiz/info")
    public ResponseEntity<List<QuizPostResponseDto>> getMyQuizPosts(@AuthenticationPrincipal CustomUserDetails userDetails){

        String username = userDetails.getUsername();
        List<QuizPostResponseDto> list = quizService.getMyQuizPosts(username);

        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    // 내가 퀴즈 푼 이력이 있는 posts(오답 있는 포스트만)
    @GetMapping("quiz/wrong/info")
    public ResponseEntity<List<QuizPostResponseDto>> getMyQuizPostsWrong(@AuthenticationPrincipal CustomUserDetails userDetails){

        String username = userDetails.getUsername();
        List<QuizPostResponseDto> list = quizService.getMyQuizPostsWrong(username);

        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    // 총 퀴즈수, 정답률 구하기
    @GetMapping("quiz/stat")
    public ResponseEntity<QuizStatDto> myQuizStat(@AuthenticationPrincipal CustomUserDetails userDetails){

        String username = userDetails.getUsername();
        QuizStatDto quizStatDto = quizService.getMyQuizStat(username);

        return ResponseEntity.status(HttpStatus.OK).body(quizStatDto);
    }
}
