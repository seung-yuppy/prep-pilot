package com.example.prep_pilot.exception;

public class DuplicateUsernameException extends RuntimeException {

    public DuplicateUsernameException(String message) {
        super(message);
    }
}
