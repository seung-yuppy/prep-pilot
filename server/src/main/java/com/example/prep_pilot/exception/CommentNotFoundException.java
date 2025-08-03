package com.example.prep_pilot.exception;

public class CommentNotFoundException extends RuntimeException {

    public CommentNotFoundException(Long id){

        super("해당 댓글 없음. id=" + id);
    }
}
