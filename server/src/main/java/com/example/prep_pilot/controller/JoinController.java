package com.example.prep_pilot.controller;

import com.example.prep_pilot.dto.UserDto;
import com.example.prep_pilot.service.JoinService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class JoinController {

    private final JoinService joinService;

    public JoinController(JoinService joinService){

        this.joinService = joinService;
    }

    @PostMapping("/join")
    public ResponseEntity<?> join(@Valid @RequestBody UserDto userDto, BindingResult bindingResult){

        if (bindingResult.hasErrors()) {
            Map<String, String> errorsMap = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errorsMap.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorsMap);
        }

        joinService.checkDuplicateUsername(userDto.getUsername());
        joinService.checkDuplicateEmail(userDto.getEmail());

        UserDto newUser = joinService.join(userDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }
}
