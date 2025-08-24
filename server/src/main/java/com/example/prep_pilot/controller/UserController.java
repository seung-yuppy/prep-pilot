package com.example.prep_pilot.controller;

import com.example.prep_pilot.dto.CustomUserDetails;
import com.example.prep_pilot.dto.NicknameBioDto;
import com.example.prep_pilot.dto.ProfileImageDto;
import com.example.prep_pilot.dto.UserDto;
import com.example.prep_pilot.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService){

        this.userService = userService;
    }

    @GetMapping("/userinfo")
    public ResponseEntity<UserDto> getUserInfo(@AuthenticationPrincipal CustomUserDetails userDetails){

        String username = userDetails.getUsername();
        UserDto userDto = userService.getUserInfo(username);

        return ResponseEntity.status(HttpStatus.OK).body(userDto);
    }

    // 닉네임 중복체크
    @PostMapping("/check/nickname")
    public ResponseEntity<String> checkNickname(@RequestBody NicknameBioDto dto){

        String message = userService.checkNickname(dto);

        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    // 닉네임, 간단소개글(bio) 수정
    @PatchMapping("/userinfo/profile")
    public ResponseEntity<NicknameBioDto> updateNicknameAndBio(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                               @RequestBody NicknameBioDto dto){

        String username = userDetails.getUsername();
        NicknameBioDto nicknameBioRequestDto = userService.updateNicknameAndBio(username, dto);

        return ResponseEntity.status(HttpStatus.OK).body(nicknameBioRequestDto);
    }

    // 프로필 이미지 업로드
    @PatchMapping("userinfo/image")
    public ResponseEntity<ProfileImageDto> updateProfileImage(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                              @RequestBody ProfileImageDto dto){
        String username = userDetails.getUsername();
        ProfileImageDto profileImageDto = userService.updateProfileImage(username, dto);

        return ResponseEntity.status(HttpStatus.OK).body(profileImageDto);
    }

    // 프로필 이미지 삭제
    @PatchMapping("userinfo/image/delete")
    public ResponseEntity<?> deleteProfileImage(@AuthenticationPrincipal CustomUserDetails userDetails){

        String username = userDetails.getUsername();
        userService.deleteProfileImage(username);

        return ResponseEntity.status(HttpStatus.OK).build();
    }


    // 해당 userId의 유저정보
    @GetMapping("/userinfo/{userId}")
    public ResponseEntity<UserDto> getUserInfoById(@PathVariable Long userId){

        UserDto userDto = userService.getUserInfoById(userId);

        return ResponseEntity.status(HttpStatus.OK).body(userDto);
    }
}
