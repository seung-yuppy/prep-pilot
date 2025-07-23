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

    public PostsDto createPost(PostsDto dto, String username) {

        User user = userRepository.findByUsername(username);
        Posts posts = Posts.toEntity(dto, user);
        Posts created = postsRepository.save(posts);

        return PostsDto.toDto(created);
    }

    public PostsDto patchPost(PostsDto dto, Long id, String username) {

        User user = userRepository.findByUsername(username);
        Posts target = postsRepository.findById(id).orElseThrow(() ->
                new PostsNotFoundException(id)
        );
        if(dto.getUserId() != user.getId())
            throw new PostsNotAuthorException(id);
        target.patch(dto);
        Posts updated = postsRepository.save(target);

        return PostsDto.toDto(updated);
    }
}
