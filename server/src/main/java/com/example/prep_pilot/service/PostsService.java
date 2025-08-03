package com.example.prep_pilot.service;

import com.example.prep_pilot.dto.PostsDto;
import com.example.prep_pilot.entity.Posts;
import com.example.prep_pilot.entity.User;
import com.example.prep_pilot.exception.PostsNotAuthorException;
import com.example.prep_pilot.exception.PostsNotFoundException;
import com.example.prep_pilot.repository.PostsRepository;
import com.example.prep_pilot.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostsService {

    private final PostsRepository postsRepository;
    private final UserRepository userRepository;

    public PostsService(PostsRepository postsRepository, UserRepository userRepository){

        this.postsRepository = postsRepository;
        this.userRepository = userRepository;
    }

    public Page<PostsDto> getRecentPosts(int page, int pageSize) {

        PageRequest pageRequest = PageRequest.of(page, pageSize);
        Page<Posts> postsPage = postsRepository.findAllByOrderByCreatedAtDesc(pageRequest);

        return postsPage.map(PostsDto::toDto);
    }

    public PostsDto getPost(Long id) {

        Posts posts = postsRepository.findById(id).orElseThrow(() ->
                new PostsNotFoundException(id)
        );

        return PostsDto.toDto(posts);
    }

    @Transactional
    public PostsDto createPost(PostsDto dto, String username) {

        User user = userRepository.findByUsername(username);
        Posts posts = Posts.toEntity(dto, user);
        Posts created = postsRepository.save(posts);

        return PostsDto.toDto(created);
    }

    @Transactional
    public PostsDto patchPost(PostsDto dto, Long id, String username) {

        User user = userRepository.findByUsername(username);
        Posts target = postsRepository.findById(id).orElseThrow(() ->
                new PostsNotFoundException(id)
        );
        if(!dto.getNickname().equals(user.getNickname()))
            throw new PostsNotAuthorException(id);
        target.patch(dto);
        Posts updated = postsRepository.save(target);

        return PostsDto.toDto(updated);
    }

    @Transactional
    public PostsDto deletePost(Long id, String username) {

        User user = userRepository.findByUsername(username);
        Posts target = postsRepository.findById(id).orElseThrow(() ->
                new PostsNotFoundException(id)
        );
        if(!target.getUser().getNickname().equals(user.getNickname()))
            throw new PostsNotAuthorException(id);

        postsRepository.delete(target);

        return PostsDto.toDto(target);
    }
}
