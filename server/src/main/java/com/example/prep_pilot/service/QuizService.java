package com.example.prep_pilot.service;

import com.example.prep_pilot.dto.*;
import com.example.prep_pilot.entity.Posts;
import com.example.prep_pilot.entity.Quiz;
import com.example.prep_pilot.entity.QuizWrongAnswer;
import com.example.prep_pilot.entity.User;
import com.example.prep_pilot.exception.PostsNotFoundException;
import com.example.prep_pilot.exception.QuizNotFoundException;
import com.example.prep_pilot.repository.PostsRepository;
import com.example.prep_pilot.repository.QuizRepository;
import com.example.prep_pilot.repository.QuizWrongAnswerRepository;
import com.example.prep_pilot.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final PostsRepository postsRepository;
    private final UserRepository userRepository;
    private final QuizWrongAnswerRepository quizWrongAnswerRepository;

    public QuizService(QuizRepository quizRepository, PostsRepository postsRepository, UserRepository userRepository, QuizWrongAnswerRepository quizWrongAnswerRepository){

        this.quizRepository = quizRepository;
        this.postsRepository = postsRepository;
        this.userRepository = userRepository;
        this.quizWrongAnswerRepository = quizWrongAnswerRepository;
    }


    public QuizResponseListDto createQuiz(Long postsId, QuizRequestDto dto){

        Map<String, Object> parameters = new LinkedHashMap<>();
        parameters.put("text", dto.getText());

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(parameters, this.getHeaders());

        RestTemplate restTemplate = new RestTemplate();

        QuizResponseListDto quizResponseListDto = restTemplate.postForObject(
                "https://prep-pilot.onrender.com/generate-quiz",
                requestEntity,
                QuizResponseListDto.class);

        Posts posts = postsRepository.findById(postsId).orElseThrow(() ->
                new PostsNotFoundException(postsId)
        );

        for(QuizResponseDto q : quizResponseListDto.getQuizzes()){
            Quiz quiz = Quiz.createQuiz(posts, q);
            quizRepository.save(quiz);
        }

        return quizResponseListDto;
    }

    private HttpHeaders getHeaders() {

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("Content-type", "application/json");

        return httpHeaders;
    }

    public Page<QuizResponseDto> getQuiz(int page, int pageSize, Long postId) {

        PageRequest pageRequest = PageRequest.of(page, pageSize);
        Page<Quiz> quizPage = quizRepository.findByPostsId(postId, pageRequest);

        return quizPage.map(QuizResponseDto::toDto);
    }

    public Boolean isPresentQuiz(Long postsId) {

        return quizRepository.existsByPostsId(postsId);
    }

    public QuizWrongAnswerDto saveMyQuiz(String username, QuizWrongAnswerDto dto, Long id) {

        User user = userRepository.findByUsername(username);
        Quiz quiz = quizRepository.findById(id).orElseThrow(() ->
                new QuizNotFoundException(id)
        );

        QuizWrongAnswer quizWrongAnswer = QuizWrongAnswer.toEntity(user, quiz, dto);

        return QuizWrongAnswerDto.toDto(quizWrongAnswerRepository.save(quizWrongAnswer));
    }

    public List<MyQuizDto> getAllMySolvedQuiz(String username, Long postsId) {

        return quizWrongAnswerRepository.findMyQuizzes(username, postsId);
    }

    public List<MyQuizDto> getMyWrongQuiz(String username, Long postsId) {

        return quizWrongAnswerRepository.findMyWrongQuizzes(username, postsId);
    }
}
