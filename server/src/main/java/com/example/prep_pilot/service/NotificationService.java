package com.example.prep_pilot.service;

import com.example.prep_pilot.dto.NotificationDto;
import com.example.prep_pilot.entity.Notifications;
import com.example.prep_pilot.exception.NotificationNotAuthorException;
import com.example.prep_pilot.exception.NotificationNotFoundException;
import com.example.prep_pilot.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository){

        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public NotificationDto notificationRead(String username, Long id) {

        Notifications notification = notificationRepository.findById(id).orElseThrow(() ->
                new NotificationNotFoundException(id)
        );
        if(!notification.getUserTo().getUsername().equals(username))
            throw new NotificationNotAuthorException(id);

        notification.setIsRead(true);

        return NotificationDto.toDto(notificationRepository.save(notification));
    }

    @Transactional
    public List<NotificationDto> notificationReadAll(String username) {

        List<Notifications> list = notificationRepository.findByUserToUsername(username);
        list.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(list);

        return list.stream().map(NotificationDto::toDto).collect(Collectors.toList());
    }

    public List<NotificationDto> getAllNotification(String username) {

        List<Notifications> list = notificationRepository.findByUserToUsername(username);

        return list.stream().map(NotificationDto::toDto).collect(Collectors.toList());
    }

    public List<NotificationDto> getUnreadNotification(String username) {

        List<Notifications> list = notificationRepository.findByUserToUsernameAndIsReadFalse(username);

        return list.stream().map(NotificationDto::toDto).collect(Collectors.toList());
    }

    @Transactional
    public NotificationDto deleteNotification(String username, Long id) {

        Notifications notification = notificationRepository.findById(id).orElseThrow(() ->
                new NotificationNotFoundException(id)
        );
        if(!notification.getUserTo().getUsername().equals(username))
            throw new NotificationNotAuthorException(id);

        notificationRepository.delete(notification);

        return NotificationDto.toDto(notification);
    }

    @Transactional
    public List<NotificationDto> deleteAllNotification(String username) {

        List<Notifications> list = notificationRepository.findByUserToUsername(username);

        notificationRepository.deleteAll(list);

        return list.stream().map(NotificationDto::toDto).collect(Collectors.toList());
    }
}
