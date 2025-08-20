package com.example.prep_pilot.repository;

import com.example.prep_pilot.entity.PostTagsId;
import com.example.prep_pilot.entity.Post_tags;
import com.example.prep_pilot.entity.Posts;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface Post_tagsRepository extends JpaRepository<Post_tags, PostTagsId> {

    List<Post_tags> findAllByPostsId(Long postsId);

    @Query("SELECT pt.posts FROM Post_tags pt WHERE pt.tags.id = :tagsId")
    Page<Posts> findPostsByTagsId(@Param("tagsId") Long tagsId, Pageable pageable);
}
