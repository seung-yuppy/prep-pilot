package com.example.prep_pilot.repository;

import com.example.prep_pilot.dto.MyQuizDto;
import com.example.prep_pilot.entity.QuizWrongAnswer;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuizWrongAnswerRepository extends JpaRepository<QuizWrongAnswer, Long> {

    @Query("SELECT new com.example.prep_pilot.dto.MyQuizDto(q.question, q.answer, qwa.userAnswer, qwa.isCorrect) " +
            "FROM QuizWrongAnswer qwa " +
            "JOIN qwa.quiz q " +
            "WHERE qwa.user.username = :username AND q.posts.id = :postsId")
    List<MyQuizDto> findMyQuizzes(@Param("username") String username, @Param("postsId") Long postsId);

    @Query("SELECT new com.example.prep_pilot.dto.MyQuizDto(q.question, q.answer, qwa.userAnswer, qwa.isCorrect) " +
            "FROM QuizWrongAnswer qwa " +
            "JOIN qwa.quiz q " +
            "WHERE qwa.user.username = :username AND q.posts.id = :postsId AND qwa.isCorrect = false")
    List<MyQuizDto> findMyWrongQuizzes(@Param("username") String username, @Param("postsId") Long postsId);
}
