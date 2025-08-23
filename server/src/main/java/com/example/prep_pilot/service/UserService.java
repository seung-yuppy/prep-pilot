package com.example.prep_pilot.service;

import com.example.prep_pilot.dto.NicknameBioDto;
import com.example.prep_pilot.dto.ProfileImageDto;
import com.example.prep_pilot.dto.UserDto;
import com.example.prep_pilot.entity.User;
import com.example.prep_pilot.exception.DuplicateNicknameException;
import com.example.prep_pilot.exception.UserNotFoundException;
import com.example.prep_pilot.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){

        this.userRepository = userRepository;
    }

    public void checkDuplicateNickname(String nickname){
        if(userRepository.existsByNickname(nickname)){
            throw new DuplicateNicknameException("이미 사용중인 닉네임입니다.");
        }
    }


    public UserDto getUserInfo(String username) {

        User user = userRepository.findByUsername(username);

        return UserDto.toDto(user);
    }

    public UserDto getUserInfoById(Long userId) {

        User user = userRepository.findById(userId).orElseThrow(() ->
                new UserNotFoundException(userId)
        );

        return UserDto.toDto(user);
    }

    public String checkNickname(NicknameBioDto dto) {

        checkDuplicateNickname(dto.getNickname());

        return "사용 가능한 닉네임입니다.";
    }

    public NicknameBioDto updateNicknameAndBio(String username, NicknameBioDto dto) {

        checkDuplicateNickname(dto.getNickname());
        User user = userRepository.findByUsername(username);
        user.setNickname(dto.getNickname());
        user.setBio(dto.getBio());

        return NicknameBioDto.toDto(userRepository.save(user));
    }

    public ProfileImageDto updateProfileImage(String username, ProfileImageDto dto) {

        User user = userRepository.findByUsername(username);
        user.setProfileImageUrl(dto.getProfileImageUrl());

        return ProfileImageDto.toDto(userRepository.save(user));
    }

    public void deleteProfileImage(String username) {

        User user = userRepository.findByUsername(username);
        user.setProfileImageUrl(null);
        userRepository.save(user);
    }
}
