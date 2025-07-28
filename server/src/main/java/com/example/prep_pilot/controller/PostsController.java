package com.example.prep_pilot.controller;

import com.example.prep_pilot.dto.CustomUserDetails;
import com.example.prep_pilot.dto.PostsDto;
import com.example.prep_pilot.entity.Posts;
import com.example.prep_pilot.service.PostsService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
public class PostsController {

    private final PostsService postsService;

    public PostsController(PostsService postsService){

        this. postsService = postsService;
    }

    @GetMapping("/posts")
    public ResponseEntity<Page<PostsDto>> getRecentPosts(@RequestParam(defaultValue = "0") int page){

        int pageSize = 12; // 한 페이지에 표시할 게시글 수
        Page<PostsDto> postsPage = postsService.getRecentPosts(page, pageSize);

        return ResponseEntity.status(HttpStatus.OK).body(postsPage);
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<PostsDto> getPost(@PathVariable Long id){

        PostsDto postsDto = postsService.getPost(id);

        return ResponseEntity.status(HttpStatus.OK).body(postsDto);
    }

    @PostMapping("/posts")
    public ResponseEntity<PostsDto> createPost(@AuthenticationPrincipal CustomUserDetails userDetails,
                                               @RequestBody PostsDto dto){

        String username = userDetails.getUsername();
        PostsDto postsDto = postsService.createPost(dto, username);

        return ResponseEntity.status(HttpStatus.CREATED).body(postsDto);
    }

    @PatchMapping("/posts/{id}")
    public ResponseEntity<PostsDto> patchPost(@AuthenticationPrincipal CustomUserDetails userDetails,
                                              @PathVariable Long id,
                                              @RequestBody PostsDto dto){

        String username = userDetails.getUsername();
        PostsDto postsDto = postsService.patchPost(dto, id, username);

        return ResponseEntity.status(HttpStatus.OK).body(postsDto);
    }
}
