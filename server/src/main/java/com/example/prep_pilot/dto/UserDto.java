package com.example.prep_pilot.dto;

import com.example.prep_pilot.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private Long id;

    @NotEmpty(message = "id는 최소 5자 이상 최대 20자 이하여야 합니다.")
    @Size(min = 5 , max = 20, message = "id는 최소 5자 이상 최대 20자 이하여야 합니다.")
    private String username;

    @NotEmpty(message = "비밀번호는 최소 8자 이상이어야 하며, 특수문자 하나 이상을 포함해야 합니다.")
    @Pattern(regexp = "^(?=.*[!@#$%^&*()-+=])(?=\\S+$).{8,}$", message = "비밀번호는 최소 8자 이상이어야 하며, 특수문자 하나 이상을 포함해야 합니다.")
    private String password;

    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @NotEmpty(message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    @NotEmpty(message = "id는 최소 5자 이상 최대 20자 이하여야 합니다.")
    @Pattern(regexp = "^[가-힣]{1,}$", message = "정확한 이름을 입력하세요.")
    private String name;

    private String role;

    public static UserDto toDto(User newUser) {

        return new UserDto(
                newUser.getId(),
                newUser.getUsername(),
                newUser.getPassword(),
                newUser.getEmail(),
                newUser.getName(),
                newUser.getRole()
        );
    }
}
