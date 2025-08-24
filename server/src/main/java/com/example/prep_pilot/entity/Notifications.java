package com.example.prep_pilot.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notifications {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User userTo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_user_id")
    private User userFrom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Posts posts;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('FOLLOW','COMMENT','LIKE')")
    private NotificationType type;

    @Column(name = "is_read")
    private Boolean isRead;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public static Notifications createCommentNotification(Posts posts, User user) {

        return new Notifications(
                null,
                posts.getUser(),
                user,
                posts,
                NotificationType.COMMENT,
                false,
                LocalDateTime.now()
        );
    }

    public static Notifications createFollowNotification(User following, User followed) {

        return new Notifications(
                null,
                followed,
                following,
                null,
                NotificationType.FOLLOW,
                false,
                LocalDateTime.now()
        );
    }

    public static Notifications createLikeNotification(Posts posts, User user) {

        return new Notifications(
                null,
                posts.getUser(),
                user,
                posts,
                NotificationType.LIKE,
                false,
                LocalDateTime.now()
        );
    }
}
