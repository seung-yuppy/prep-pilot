package com.example.prep_pilot.service;

import com.example.prep_pilot.dto.UserDto;
import com.example.prep_pilot.entity.User;
import com.example.prep_pilot.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){

        this.userRepository = userRepository;
    }


    public UserDto getUserInfo(String username) {

        User user = userRepository.findByUsername(username);

        return UserDto.toDto(user);
    }
}
