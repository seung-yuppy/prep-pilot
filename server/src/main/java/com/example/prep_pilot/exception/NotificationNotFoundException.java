package com.example.prep_pilot.exception;

public class NotificationNotFoundException extends RuntimeException {

    public NotificationNotFoundException(Long id){

        super("해당 알림 없음. id=" + id);
    }
}
