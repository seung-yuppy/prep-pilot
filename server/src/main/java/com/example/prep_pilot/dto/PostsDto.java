package com.example.prep_pilot.dto;

import com.example.prep_pilot.entity.Posts;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostsDto {

    private Long id;

    private String title;

    private String content;

    private String slug;

    private Boolean isPrivate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Long userId;

    public static PostsDto toDto(Posts posts) {

        return new PostsDto(
                posts.getId(),
                posts.getTitle(),
                posts.getContent(),
                posts.getSlug(),
                posts.getIsPrivate(),
                posts.getCreatedAt(),
                posts.getUpdatedAt(),
                posts.getUser().getId()
        );
    }
}
