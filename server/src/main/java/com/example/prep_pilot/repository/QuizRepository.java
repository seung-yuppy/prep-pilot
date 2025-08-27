package com.example.prep_pilot.repository;

import com.example.prep_pilot.entity.Quiz;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    Page<Quiz> findByPostsId(Long postsId, Pageable pageable);
}
