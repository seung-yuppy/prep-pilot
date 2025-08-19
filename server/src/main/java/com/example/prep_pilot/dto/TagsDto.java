package com.example.prep_pilot.dto;

import com.example.prep_pilot.entity.Tags;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TagsDto {

    private Long id;
    private String name;

    public static TagsDto toDto(Tags tags) {

        return new TagsDto(
                tags.getId(),
                tags.getName()
        );
    }
}
