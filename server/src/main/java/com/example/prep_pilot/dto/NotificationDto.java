package com.example.prep_pilot.dto;

import com.example.prep_pilot.entity.Notifications;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.format.DateTimeFormatter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDto {

    private Long id;

    private String message;

    private Boolean isRead;

    private String createdAt;

    public static NotificationDto toDto(Notifications notification) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 M월 d일 H:m");
        String msg;
        switch (notification.getType()){
            case COMMENT :
                msg = "[" + notification.getPosts().getTitle() + "] 글에 새로운 댓글이 달렸어요.";
                break;
            case FOLLOW :
                msg = "[" + notification.getUserFrom().getNickname() + "] 님이 회원님을 팔로우 하셨어요.";
                break;
            default :
                msg = "[" + notification.getUserFrom().getNickname() + "] 님이 회원님의 [" +
                        notification.getPosts().getTitle() + "] 글을 좋아합니다.";
        }

        return new NotificationDto(
                notification.getId(),
                msg,
                notification.getIsRead(),
                notification.getCreatedAt().format(formatter)
        );
    }
}
