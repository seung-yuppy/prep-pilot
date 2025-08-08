package com.example.prep_pilot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ViewsDto {

    private Long id;
    private String postsId;
    private String userId;
    private LocalDateTime createdAt;
}
