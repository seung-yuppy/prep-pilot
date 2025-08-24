package com.example.prep_pilot.dto;

import com.example.prep_pilot.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IntroduceDto {

    private String introduce;

    public static IntroduceDto toDto(User user) {
        return new IntroduceDto(
                user.getIntroduce()
        );
    }
}
