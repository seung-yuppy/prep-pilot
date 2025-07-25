package com.example.prep_pilot.exception;

public class PostsNotFoundException extends RuntimeException {
    public PostsNotFoundException(Long id) {

        super("해당 게시글 없음. id=" + id);
    }
}
