package com.example.prep_pilot.controller;

import com.example.prep_pilot.dto.CustomUserDetails;
import com.example.prep_pilot.dto.NotificationDto;
import com.example.prep_pilot.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService){

        this.notificationService = notificationService;
    }

    // 해당 알림 읽음처리
    @PostMapping("/notification/{id}/read")
    public ResponseEntity<NotificationDto> notificationRead(@PathVariable Long id){

        NotificationDto notificationDto = notificationService.notificationRead(id);

        return ResponseEntity.status(HttpStatus.OK).body(notificationDto);
    }
}
