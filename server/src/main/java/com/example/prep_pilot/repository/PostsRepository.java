package com.example.prep_pilot.repository;


import com.example.prep_pilot.entity.Posts;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostsRepository extends JpaRepository<Posts, Long> {

    Page<Posts> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Posts> findByUserUsernameOrderByCreatedAtDesc(String username, Pageable pageable);

    Page<Posts> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Posts> findByUserNicknameIgnoreCase(String nickname, Pageable pageable);

    Page<Posts> findByContentContainingIgnoreCase(String content, Pageable pageable);

    Page<Posts> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String title, String content, Pageable pageable);
}
