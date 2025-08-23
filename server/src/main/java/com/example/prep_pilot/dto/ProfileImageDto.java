package com.example.prep_pilot.dto;

import com.example.prep_pilot.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileImageDto {

    private String profileImageUrl;

    public static ProfileImageDto toDto(User user) {

        return new ProfileImageDto(
                user.getProfileImageUrl()
        );
    }
}
