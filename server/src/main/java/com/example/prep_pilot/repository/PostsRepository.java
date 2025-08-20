package com.example.prep_pilot.repository;


import com.example.prep_pilot.dto.PostsDto;
import com.example.prep_pilot.entity.Posts;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PostsRepository extends JpaRepository<Posts, Long> {

    Page<Posts> findAllByIsPrivateFalseOrderByCreatedAtDesc(Pageable pageable);

    Page<Posts> findByUserUsernameOrderByCreatedAtDesc(String username, Pageable pageable);

    Page<Posts> findByTitleContainingIgnoreCaseAndIsPrivateFalse(String title, Pageable pageable);

    Page<Posts> findByUserNicknameIgnoreCaseAndIsPrivateFalse(String nickname, Pageable pageable);

    Page<Posts> findByContentContainingIgnoreCaseAndIsPrivateFalse(String content, Pageable pageable);

    /*
      시간 감쇠 공식이 적용된 화제글을 조회하여 바로 PostsDto로 변환
     - 화제글 점수 공식: (댓글 수 * 3) + (좋아요 수 * 5) - (경과 시간(h) * 0.02)
     */
    @Query("SELECT new com.example.prep_pilot.dto.PostsDto(" +
            "p.id, p.title, p.slug, p.isPrivate, p.createdAt, p.updatedAt, u.nickname, " +
            "COUNT(DISTINCT c.id), COUNT(DISTINCT l.id)) " +
            "FROM Posts p " +
            "LEFT JOIN p.user u " +
            "LEFT JOIN Comment c ON c.posts = p AND c.isDeleted = false " +
            "LEFT JOIN Likes l ON l.posts = p " +
            "WHERE p.isPrivate = false " +
            "GROUP BY p.id, u.nickname " +
            "ORDER BY (3 * COUNT(DISTINCT c.id) + 5 * COUNT(DISTINCT l.id) " +
            "- 0.02 * (CAST(FUNCTION('UNIX_TIMESTAMP', CURRENT_TIMESTAMP) AS double) - CAST(FUNCTION('UNIX_TIMESTAMP', p.createdAt) AS double)) / 3600.0) DESC, p.createdAt DESC")
    Page<PostsDto> findTrendingPosts(Pageable pageable);
}
