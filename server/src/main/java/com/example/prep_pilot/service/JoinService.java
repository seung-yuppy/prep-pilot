package com.example.prep_pilot.service;

import com.example.prep_pilot.dto.UserDto;
import com.example.prep_pilot.entity.User;
import com.example.prep_pilot.exception.DuplicateEmailException;
import com.example.prep_pilot.exception.DuplicateNicknameException;
import com.example.prep_pilot.exception.DuplicateUsernameException;
import com.example.prep_pilot.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class JoinService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public JoinService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder){

        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Transactional
    public UserDto join(UserDto userDto) {

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        user.setName(userDto.getName());
        user.setNickname(userDto.getNickname());
        user.setRole("ROLE_USER");
        user.setCreatedAt(LocalDateTime.now());

        User newUser = userRepository.save(user);

        return UserDto.toDto(newUser);
    }

    @Transactional
    public UserDto deleteUser(String username) {
        User user = userRepository.findByUsername(username);
        userRepository.delete(user);

        return UserDto.toDto(user);
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

    public void checkDuplicateNickname(String nickname){
        if(userRepository.existsByNickname(nickname)){
            throw new DuplicateNicknameException("이미 사용중인 닉네임입니다.");
        }
    }
}
