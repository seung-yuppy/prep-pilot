package com.example.prep_pilot.controller;

import com.example.prep_pilot.dto.CustomUserDetails;
import com.example.prep_pilot.dto.NotificationDto;
import com.example.prep_pilot.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService){

        this.notificationService = notificationService;
    }

    // 해당 알림 읽음처리
    @PostMapping("/notification/{id}/read")
    public ResponseEntity<NotificationDto> notificationRead(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                            @PathVariable Long id){

        String username = userDetails.getUsername();
        NotificationDto notificationDto = notificationService.notificationRead(username, id);

        return ResponseEntity.status(HttpStatus.OK).body(notificationDto);
    }

    // 전체 알림 읽음처리
    @PostMapping("/notification/all/read")
    public ResponseEntity<List<NotificationDto>> notificationReadAll(@AuthenticationPrincipal CustomUserDetails userDetails){

        String username = userDetails.getUsername();
        List<NotificationDto> list = notificationService.notificationReadAll(username);

        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    // 전체 알림 보기
    @GetMapping("/notification/all")
    public ResponseEntity<List<NotificationDto>> getAllNotification(@AuthenticationPrincipal CustomUserDetails userDetails){

        String username = userDetails.getUsername();
        List<NotificationDto> list = notificationService.getAllNotification(username);

        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    // 읽지 않은 알림 리스트
    @GetMapping("/notification/unread")
    public ResponseEntity<List<NotificationDto>> getUnreadNotification(@AuthenticationPrincipal CustomUserDetails userDetails){

        String username = userDetails.getUsername();
        List<NotificationDto> list = notificationService.getUnreadNotification(username);

        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    // 알림 하나 삭제
    @DeleteMapping("/notification/{id}")
    public ResponseEntity<NotificationDto> deleteNotification(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                              @PathVariable Long id){

        String username = userDetails.getUsername();
        NotificationDto notificationDto = notificationService.deleteNotification(username, id);

        return ResponseEntity.status(HttpStatus.OK).body(notificationDto);
    }

    // 알림 전체 삭제
    @DeleteMapping("/notification/all")
    public ResponseEntity<List<NotificationDto>> deleteAllNotification(@AuthenticationPrincipal CustomUserDetails userDetails){

        String username = userDetails.getUsername();
        List<NotificationDto> list = notificationService.deleteAllNotification(username);

        return ResponseEntity.status(HttpStatus.OK).body(list);
    }
}
