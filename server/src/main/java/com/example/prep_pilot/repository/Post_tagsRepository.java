package com.example.prep_pilot.repository;

import com.example.prep_pilot.entity.PostTagsId;
import com.example.prep_pilot.entity.Post_tags;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface Post_tagsRepository extends JpaRepository<Post_tags, PostTagsId> {

    List<Post_tags> findAllByPostsId(Long postsId);
}
