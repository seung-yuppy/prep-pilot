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
public class NicknameBioDto {

    private String nickname;

    private String bio;


    public static NicknameBioDto toDto(User user) {

        return new NicknameBioDto(
                user.getNickname(),
                user.getBio()
        );
    }
}
