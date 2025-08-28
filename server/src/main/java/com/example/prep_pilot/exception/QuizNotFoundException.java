package com.example.prep_pilot.exception;

public class QuizNotFoundException extends RuntimeException {

    public QuizNotFoundException(Long id){
        super("해당 퀴즈 없음. id=" + id);
    }
}
