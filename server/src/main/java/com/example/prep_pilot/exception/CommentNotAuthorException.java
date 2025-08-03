package com.example.prep_pilot.exception;

public class CommentNotAuthorException extends RuntimeException {

    public CommentNotAuthorException(Long id){
        super("해당 댓글의 작성자가 아닙니다." + id);
    }
}
