package com.example.prep_pilot.service;

import com.example.prep_pilot.dto.QuizRequestDto;
import com.example.prep_pilot.dto.QuizResponseDto;
import com.example.prep_pilot.dto.QuizResponseListDto;
import com.example.prep_pilot.entity.Posts;
import com.example.prep_pilot.entity.Quiz;
import com.example.prep_pilot.exception.PostsNotFoundException;
import com.example.prep_pilot.repository.PostsRepository;
import com.example.prep_pilot.repository.QuizRepository;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final PostsRepository postsRepository;

    public QuizService(QuizRepository quizRepository, PostsRepository postsRepository){

        this.quizRepository = quizRepository;
        this.postsRepository = postsRepository;
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
}
