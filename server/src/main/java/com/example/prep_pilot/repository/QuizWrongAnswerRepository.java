package com.example.prep_pilot.repository;

import com.example.prep_pilot.dto.MyQuizDto;
import com.example.prep_pilot.dto.QuizPostResponseDto;
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

    @Query("SELECT DISTINCT new com.example.prep_pilot.dto.QuizPostResponseDto(p.id, p.title, p.createdAt) " +
            "FROM QuizWrongAnswer qwa " +
            "JOIN qwa.quiz q " +
            "JOIN q.posts p " +
            "JOIN qwa.user u " +
            "WHERE u.username = :username")
    List<QuizPostResponseDto> findQuizPostsByUsername(@Param("username") String username);

    @Query("SELECT DISTINCT new com.example.prep_pilot.dto.QuizPostResponseDto(p.id, p.title, p.createdAt) " +
            "FROM QuizWrongAnswer qwa " +
            "JOIN qwa.quiz q " +
            "JOIN q.posts p " +
            "JOIN qwa.user u " +
            "WHERE u.username = :username AND qwa.isCorrect = false")
    List<QuizPostResponseDto> findWrongQuizPostsByUsername(@Param("username") String username);

    Long countByUserUsername(String username);

    Long countByUserUsernameAndIsCorrectFalse(String username);
}
