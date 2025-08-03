package com.example.prep_pilot.repository;

import com.example.prep_pilot.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostsId(Long id);

    @Query("SELECT c FROM Comment c " +
            "JOIN FETCH c.user u " +
            "LEFT JOIN FETCH c.parent p " +
            "WHERE c.posts.id = :postsId")
    List<Comment> findAllCommentsWithUser(@Param("postsId") Long postsId);

}
