package com.example.prep_pilot.repository;


import com.example.prep_pilot.entity.Posts;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostsRepository extends JpaRepository<Posts, Long> {

    Page<Posts> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
