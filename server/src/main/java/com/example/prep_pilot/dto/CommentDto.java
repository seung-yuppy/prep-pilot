package com.example.prep_pilot.dto;

import com.example.prep_pilot.entity.Comment;
import com.example.prep_pilot.entity.Posts;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {

    private Long id;
    private Long postsId;
    private Long parentId;
    private List<CommentDto> children = new ArrayList<>();
    private String content;
    private Boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;

    public static CommentDto toDto(Comment c) {

        return new CommentDto(
                c.getId(),
                c.getPosts().getId(),
                c.getParent() != null ? c.getParent().getId() : null,
                new ArrayList<>(),
                c.getContent(),
                c.getIsDeleted(),
                c.getCreatedAt(),
                c.getUpdatedAt(),
                c.getUser().getId()
        );
    }
}
