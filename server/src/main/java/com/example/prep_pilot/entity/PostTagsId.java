package com.example.prep_pilot.entity;

import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@EqualsAndHashCode
@NoArgsConstructor
public class PostTagsId implements Serializable {

    private Long posts;
    private Long tags;
}
