package com.example.prep_pilot.service;

import com.example.prep_pilot.dto.NotificationDto;
import com.example.prep_pilot.entity.Notifications;
import com.example.prep_pilot.exception.NotificationNotFoundException;
import com.example.prep_pilot.repository.NotificationRepository;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository){

        this.notificationRepository = notificationRepository;
    }

    public NotificationDto notificationRead(Long id) {

        Notifications notification = notificationRepository.findById(id).orElseThrow(() ->
                new NotificationNotFoundException(id)
        );

        notification.setIsRead(true);

        return NotificationDto.toDto(notificationRepository.save(notification));
    }
}
