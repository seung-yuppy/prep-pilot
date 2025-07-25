package com.example.prep_pilot.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class PostsExceptionHandler {

    @ExceptionHandler(PostsNotFoundException.class)
    public ResponseEntity<?> handlePostNotFound(PostsNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(PostsNotAuthorException.class)
    public ResponseEntity<?> handlePostNotAuthor(PostsNotAuthorException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", ex.getMessage()));
    }
}
