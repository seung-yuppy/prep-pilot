package com.example.prep_pilot.service;

import com.example.prep_pilot.dto.PostsDto;
import com.example.prep_pilot.entity.Post_tags;
import com.example.prep_pilot.entity.Posts;
import com.example.prep_pilot.entity.Tags;
import com.example.prep_pilot.entity.User;
import com.example.prep_pilot.exception.PostsNotAuthorException;
import com.example.prep_pilot.exception.PostsNotFoundException;
import com.example.prep_pilot.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostsService {

    private final PostsRepository postsRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final LikesRepository likesRepository;
    private final ViewsRepository viewsRepository;
    private final TagsRepository tagsRepository;
    private final Post_tagsRepository postTagsRepository;

    public PostsService(PostsRepository postsRepository, UserRepository userRepository, CommentRepository commentRepository, LikesRepository likesRepository, ViewsRepository viewsRepository, TagsRepository tagsRepository, Post_tagsRepository postTagsRepository){

        this.postsRepository = postsRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.likesRepository = likesRepository;
        this.viewsRepository = viewsRepository;
        this.tagsRepository = tagsRepository;
        this.postTagsRepository = postTagsRepository;
    }

    public Page<PostsDto> getRecentPosts(int page, int pageSize) {

        PageRequest pageRequest = PageRequest.of(page, pageSize);
        Page<Posts> postsPage = postsRepository.findAllByIsPrivateFalseOrderByCreatedAtDesc(pageRequest);

        return postsPage.map(posts -> {
            PostsDto dto = PostsDto.toDto(posts);
            dto.setCommentCounts((long) commentRepository.findByPostsId(dto.getId()).size());
            dto.setLikesCounts(likesRepository.countByPostsId(dto.getId()));
            return dto;
        });
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

        for(Long tagId : dto.getTagIds()) {
            Optional<Tags> tags = tagsRepository.findById(tagId);
            if(tags.isPresent()) {
                Post_tags postTags = new Post_tags(created, tags.get());
                postTagsRepository.save(postTags);
            }
        }

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

    public Page<PostsDto> getMyWatchedPosts(int page, int pageSize, String username) {

        PageRequest pageRequest = PageRequest.of(page, pageSize);
        Page<Posts> postsPage = viewsRepository.findPostsByUserUsernameOrderByCreatedAtDesc(username, pageRequest);

        return postsPage.map(posts -> {
            PostsDto dto = PostsDto.toDto(posts);
            dto.setCommentCounts((long) commentRepository.findByPostsId(dto.getId()).size());
            dto.setLikesCounts(likesRepository.countByPostsId(dto.getId()));
            return dto;
        });
    }

    public Page<PostsDto> getMyLikePosts(int page, int pageSize, String username) {

        PageRequest pageRequest = PageRequest.of(page, pageSize);
        Page<Posts> postsPage = likesRepository.findPostsByUserUsernameOrderByCreatedAtDesc(username, pageRequest);

        return postsPage.map(posts -> {
            PostsDto dto = PostsDto.toDto(posts);
            dto.setCommentCounts((long) commentRepository.findByPostsId(dto.getId()).size());
            dto.setLikesCounts(likesRepository.countByPostsId(dto.getId()));
            return dto;
        });
    }

    public Page<PostsDto> getMyPosts(int page, int pageSize, String username) {

        PageRequest pageRequest = PageRequest.of(page, pageSize);
        Page<Posts> postsPage = postsRepository.findByUserUsernameOrderByCreatedAtDesc(username, pageRequest);

        return postsPage.map(posts -> {
            PostsDto dto = PostsDto.toDto(posts);
            dto.setCommentCounts((long) commentRepository.findByPostsId(dto.getId()).size());
            dto.setLikesCounts(likesRepository.countByPostsId(dto.getId()));
            return dto;
        });
    }

    public Page<PostsDto> getPostsByTitle(int page, int pageSize, String title) {

        PageRequest pageRequest = PageRequest.of(page, pageSize);
        Page<Posts> postsPage = postsRepository.findByTitleContainingIgnoreCaseAndIsPrivateFalse(title, pageRequest);

        return postsPage.map(posts -> {
            PostsDto dto = PostsDto.toDto(posts);
            dto.setCommentCounts((long) commentRepository.findByPostsId(dto.getId()).size());
            dto.setLikesCounts(likesRepository.countByPostsId(dto.getId()));
            return dto;
        });
    }

    public Page<PostsDto> getPostsByNickname(int page, int pageSize, String nickname) {

        PageRequest pageRequest = PageRequest.of(page, pageSize);
        Page<Posts> postsPage = postsRepository.findByUserNicknameIgnoreCaseAndIsPrivateFalse(nickname, pageRequest);

        return postsPage.map(posts -> {
            PostsDto dto = PostsDto.toDto(posts);
            dto.setCommentCounts((long) commentRepository.findByPostsId(dto.getId()).size());
            dto.setLikesCounts(likesRepository.countByPostsId(dto.getId()));
            return dto;
        });
    }

    public Page<PostsDto> getPostsByContent(int page, int pageSize, String content) {

        PageRequest pageRequest = PageRequest.of(page, pageSize);
        Page<Posts> postsPage = postsRepository.findByContentContainingIgnoreCaseAndIsPrivateFalse(content, pageRequest);

        return postsPage.map(posts -> {
            PostsDto dto = PostsDto.toDto(posts);
            dto.setCommentCounts((long) commentRepository.findByPostsId(dto.getId()).size());
            dto.setLikesCounts(likesRepository.countByPostsId(dto.getId()));
            return dto;
        });
    }

    public Page<PostsDto> getPostsByTags(int page, int pageSize, Long tagsId) {

        PageRequest pageRequest = PageRequest.of(page,pageSize);
        Page<Posts> postsPage = postTagsRepository.findPostsByTagsId(tagsId, pageRequest);

        return postsPage.map(posts -> {
            PostsDto dto = PostsDto.toDto(posts);
            dto.setCommentCounts((long) commentRepository.findByPostsId(dto.getId()).size());
            dto.setLikesCounts(likesRepository.countByPostsId(dto.getId()));
            return dto;
        });
    }

    public Page<PostsDto> getTrendingPosts(int page, int pageSize) {

        PageRequest pageRequest = PageRequest.of(page,pageSize);

        return postsRepository.findTrendingPosts(pageRequest);
    }

    public List<PostsDto> getPostsByTagNameInUserinfo(String tagName, Long userId) {

        List<Posts> postsList = postsRepository.findByTagNameAndUserIdAndPublic(tagName, userId);

        return postsList.stream().map(PostsDto::toDto).collect(Collectors.toList());
    }

    public List<PostsDto> searchPostsByTitleInUserinfo(Long userId, String title) {

        List<Posts> postsList = postsRepository.findByUserIdAndIsPrivateFalseAndTitleContainingIgnoreCase(userId, title);

        return postsList.stream().map(PostsDto::toDto).collect(Collectors.toList());
    }

    public Page<PostsDto> getPostsByUserId(int page, int pageSize, Long userId) {

        PageRequest pageRequest = PageRequest.of(page, pageSize);
        Page<Posts> postsPage = postsRepository.findByUserIdAndIsPrivateFalse(userId, pageRequest);

        return postsPage.map(posts -> {
            PostsDto dto = PostsDto.toDto(posts);
            dto.setCommentCounts((long) commentRepository.findByPostsId(dto.getId()).size());
            dto.setLikesCounts(likesRepository.countByPostsId(dto.getId()));
            return dto;
        });
    }
}
