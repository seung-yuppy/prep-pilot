<<<<<<< HEAD
package com.example.prep_pilot.entity;

import com.example.prep_pilot.dto.PostsDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Posts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String content;

    private String slug;

    @Column(name = "is_private")
    private Boolean isPrivate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public static Posts toEntity(PostsDto dto, User user) {

        return new Posts(
                null,
                dto.getTitle(),
                dto.getContent(),
                dto.getSlug(),
                dto.getIsPrivate(),
                LocalDateTime.now(),
                null,
                user
        );
    }

    public void patch(PostsDto dto) {

        this.title = dto.getTitle();
        this.content = dto.getContent();
        this.slug = dto.getSlug();
        this.isPrivate = dto.getIsPrivate();
        this.updatedAt = LocalDateTime.now();
    }
}
=======
package com.example.prep_pilot.entity;

import com.example.prep_pilot.dto.PostsDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Posts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String content;

    private String slug;

    @Column(name = "is_private")
    private Boolean isPrivate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public static Posts toEntity(PostsDto dto, User user) {

        return new Posts(
                null,
                dto.getTitle(),
                dto.getContent(),
                dto.getSlug(),
                dto.getIsPrivate(),
                LocalDateTime.now(),
                null,
                user
        );
    }

    public void patch(PostsDto dto) {

        this.title = dto.getTitle();
        this.content = dto.getContent();
        this.slug = dto.getSlug();
        this.isPrivate = dto.getIsPrivate();
        this.updatedAt = LocalDateTime.now();
    }
}
>>>>>>> 78a8c82cf68a557acf96b9d28a2a05fac938836f
