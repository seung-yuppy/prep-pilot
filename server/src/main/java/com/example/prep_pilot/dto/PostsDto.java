package com.example.prep_pilot.dto;

import com.example.prep_pilot.entity.Posts;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
<<<<<<< HEAD
import java.time.format.DateTimeFormatter;
=======

import java.time.LocalDateTime;
>>>>>>> 78a8c82cf68a557acf96b9d28a2a05fac938836f

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

<<<<<<< HEAD
    private String createdAt;

    private String updatedAt;

    private String nickname;

    public static PostsDto toDto(Posts posts) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 M월 d일");
        String updatedAtStr = posts.getUpdatedAt() != null ? posts.getUpdatedAt().format(formatter) : null;

=======
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Long userId;

    public static PostsDto toDto(Posts posts) {

>>>>>>> 78a8c82cf68a557acf96b9d28a2a05fac938836f
        return new PostsDto(
                posts.getId(),
                posts.getTitle(),
                posts.getContent(),
                posts.getSlug(),
                posts.getIsPrivate(),
<<<<<<< HEAD
                posts.getCreatedAt().format(formatter),
                updatedAtStr,
                posts.getUser().getNickname()
=======
                posts.getCreatedAt(),
                posts.getUpdatedAt(),
                posts.getUser().getId()
>>>>>>> 78a8c82cf68a557acf96b9d28a2a05fac938836f
        );
    }
}
