package com.example.prep_pilot.service;

import com.example.prep_pilot.dto.FollowsDto;
import com.example.prep_pilot.dto.NotificationDto;
import com.example.prep_pilot.entity.Follows;
import com.example.prep_pilot.entity.Notifications;
import com.example.prep_pilot.entity.User;
import com.example.prep_pilot.exception.UserNotFoundException;
import com.example.prep_pilot.repository.FollowsRepository;
import com.example.prep_pilot.repository.NotificationRepository;
import com.example.prep_pilot.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FollowsService {

    private final FollowsRepository followsRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public FollowsService(FollowsRepository followsRepository, UserRepository userRepository, NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate){

        this.followsRepository = followsRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public void postFollows(String username, Long userId) {

        User following = userRepository.findByUsername(username);
        User followed = userRepository.findById(userId).orElseThrow(() ->
                new UserNotFoundException(userId)
        );
        if(following.equals(followed))
            return;
        Optional<Follows> follows = followsRepository.findByFollowerUserIdAndFollowingUserUsername(userId, username);
        if(follows.isPresent())
            followsRepository.delete(follows.get());
        else {
            followsRepository.save(new Follows(null, followed, following, LocalDateTime.now()));
            Notifications notification = Notifications.createFollowNotification(following, followed);
            notificationRepository.save(notification);
            NotificationDto notificationDto = NotificationDto.toDto(notification);
            // "/topic/notifications/{userId}" 구독한 사용자에게 메시지 전송
            messagingTemplate.convertAndSend("/topic/notifications/" + followed.getId(), notificationDto);
        }
    }

    public Boolean isFollowing(String username, Long userId) {

        Optional<Follows> follows = followsRepository.findByFollowerUserIdAndFollowingUserUsername(userId, username);

        return follows.isPresent();
    }

    public List<FollowsDto> getFollower(Long id) {

        List<Follows> followers = followsRepository.findByFollowerUserId(id);

        return followers.stream().map(FollowsDto::getFollowers).collect(Collectors.toList());
    }

    public List<FollowsDto> getFollowings(Long id) {

        List<Follows> followings = followsRepository.findByFollowingUserId(id);

        return followings.stream().map(FollowsDto::getFollowings).collect(Collectors.toList());
    }
}
