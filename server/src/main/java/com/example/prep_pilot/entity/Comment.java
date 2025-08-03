package com.example.prep_pilot.entity;

import com.example.prep_pilot.dto.CommentDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Posts posts;

    // 부모 댓글 참조 (대댓글 기능 추가)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Comment parent;

    // 자식 댓글 리스트 (부모 댓글이 삭제되어도 자식 댓글 유지)
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Comment> children = new ArrayList<>();

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public static Comment toEntity(CommentDto commentDto, Posts posts, User user, Comment parent) {

        return new Comment(
                null,
                posts,
                parent,
                new ArrayList<>(),
                commentDto.getContent(),
                false,
                LocalDateTime.now(),
                null,
                user
        );
    }

    public void patch(CommentDto commentDto) {

        content = commentDto.getContent();
        updatedAt = LocalDateTime.now();
    }
}
