package com.example.prep_pilot.service;

import com.example.prep_pilot.dto.UserDto;
import com.example.prep_pilot.entity.User;
import com.example.prep_pilot.exception.DuplicateEmailException;
import com.example.prep_pilot.exception.DuplicateUsernameException;
import com.example.prep_pilot.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class JoinService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public JoinService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder){

        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }
    public UserDto join(UserDto userDto) {

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        user.setName(userDto.getName());
        user.setRole("ROLE_USER");

        User newUser = userRepository.save(user);

        return UserDto.toDto(newUser);
    }

    public void checkDuplicateUsername(String username) {
        if (userRepository.existsByUsername(username)) {
            throw new DuplicateUsernameException("이미 사용중인 아이디입니다.");
        }
    }

    public void checkDuplicateEmail(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateEmailException("이미 사용중인 이메일입니다.");
        }
    }
}
