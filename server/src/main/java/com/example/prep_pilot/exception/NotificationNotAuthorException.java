package com.example.prep_pilot.exception;

public class NotificationNotAuthorException extends RuntimeException {

    public NotificationNotAuthorException(Long id) {

        super("해당 알림 대상자가 아닙니다. id=" + id);
    }
}
