package com.example.prep_pilot.exception;

public class PostsNotAuthorException extends RuntimeException {

    public PostsNotAuthorException(Long id) {

        super("해당 게시글 작성자가 아닙니다. id=" + id);
    }
}
