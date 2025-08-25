package com.example.prep_pilot.exception;

public class TagsNotFoundException extends RuntimeException {

    public TagsNotFoundException(Long id){

        super("해당 태그 없음. id=" + id);
    }
}
