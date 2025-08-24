package com.example.prep_pilot.service;

import com.example.prep_pilot.dto.CommentDto;
import com.example.prep_pilot.dto.NotificationDto;
import com.example.prep_pilot.entity.*;
import com.example.prep_pilot.exception.CommentNotAuthorException;
import com.example.prep_pilot.exception.CommentNotFoundException;
import com.example.prep_pilot.exception.PostsNotFoundException;
import com.example.prep_pilot.repository.CommentRepository;
import com.example.prep_pilot.repository.NotificationRepository;
import com.example.prep_pilot.repository.PostsRepository;
import com.example.prep_pilot.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostsRepository postsRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate; // 웹소켓 메시지 전송

    public CommentService(CommentRepository commentRepository, PostsRepository postsRepository, UserRepository userRepository, NotificationRepository notificationRepository, SimpMessagingTemplate simpMessagingTemplate){

        this.commentRepository = commentRepository;
        this.postsRepository = postsRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = simpMessagingTemplate;
    }

    public List<CommentDto> getComments(Long postsId) {

        if (!postsRepository.existsById(postsId)) {
            throw new PostsNotFoundException(postsId);
        }
        List<Comment> comments = commentRepository.findAllCommentsWithUser(postsId);
        Map<Long, CommentDto> map = new HashMap<>();
        List<CommentDto> roots = new ArrayList<>();

        for (Comment c : comments) {
            CommentDto dto = CommentDto.toDto(c);
            map.put(dto.getId(), dto);
        }

        for (CommentDto dto : map.values()) {
            if (dto.getParentId() != null) {
                CommentDto parent = map.get(dto.getParentId());
                if (parent != null) {
                    parent.getChildren().add(dto);
                }
            }
            else {
                roots.add(dto);
            }
        }

        return roots;
    }

    @Transactional
    public CommentDto createComment(String username, Long postsId, CommentDto commentDto) {

        Posts posts = postsRepository.findById(postsId).orElseThrow(() ->
                new PostsNotFoundException(postsId)
        );
        User user = userRepository.findByUsername(username);
        Comment comment = Comment.toEntity(commentDto, posts, user, null);
        Comment newComment = commentRepository.save(comment);

        if(!username.equals(posts.getUser().getUsername())) {
            Notifications notification = Notifications.createCommentNotification(posts, user);
            notificationRepository.save(notification);
            NotificationDto notificationDto = NotificationDto.toDto(notification);
            // "/topic/notifications/{userId}" 구독한 사용자에게 메시지 전송
            messagingTemplate.convertAndSend("/topic/notifications/" + posts.getUser().getId(), notificationDto);
        }
        return CommentDto.toDto(newComment);
    }

    @Transactional
    public CommentDto createReply(String username, Long postsId, Long parentId, CommentDto commentDto) {

        Posts posts = postsRepository.findById(postsId).orElseThrow(() ->
                new PostsNotFoundException(postsId)
        );
        User user = userRepository.findByUsername(username);
        Comment parent = commentRepository.findById(parentId).orElseThrow(() ->
                new CommentNotFoundException(parentId)
        );
        Comment reply = Comment.toEntity(commentDto, posts, user, parent);
        Comment newReply = commentRepository.save(reply);

        if(!username.equals(posts.getUser().getUsername())) {
            Notifications notification = Notifications.createCommentNotification(posts, user);
            notificationRepository.save(notification);
            NotificationDto notificationDto = NotificationDto.toDto(notification);
            // "/topic/notifications/{userId}" 구독한 사용자에게 메시지 전송
            messagingTemplate.convertAndSend("/topic/notifications/" + posts.getUser().getId(), notificationDto);
        }

        return CommentDto.toDto(newReply);
    }

    public CommentDto updateComment(String username, Long id, CommentDto commentDto) {

        User user = userRepository.findByUsername(username);
        Comment comment = commentRepository.findById(id).orElseThrow(() ->
                new CommentNotFoundException(id)
        );
        if(!comment.getUser().getId().equals(user.getId()))
            throw new CommentNotAuthorException(id);
        comment.patch(commentDto);
        Comment updated = commentRepository.save(comment);

        return CommentDto.toDto(updated);
    }

    public CommentDto deleteComment(String username, Long id) {

        User user = userRepository.findByUsername(username);
        Comment comment = commentRepository.findById(id).orElseThrow(() ->
                new CommentNotFoundException(id)
        );
        if(!comment.getUser().getId().equals(user.getId()))
            throw new CommentNotAuthorException(id);

        comment.setContent("삭제된 댓글입니다.");
        comment.setIsDeleted(true);
        commentRepository.save(comment);

        return CommentDto.toDto(comment);
    }
}
