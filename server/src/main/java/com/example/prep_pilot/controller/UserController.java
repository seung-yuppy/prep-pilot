package com.example.prep_pilot.controller;

import com.example.prep_pilot.dto.CustomUserDetails;
import com.example.prep_pilot.dto.UserDto;
import com.example.prep_pilot.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
