package com.example.prep_pilot.controller;

import com.example.prep_pilot.dto.CustomUserDetails;
import com.example.prep_pilot.dto.PostsDto;
import com.example.prep_pilot.service.PostsService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<PostsDto> deletePost(@AuthenticationPrincipal CustomUserDetails userDetails,
                                               @PathVariable Long id){

        String username = userDetails.getUsername();
        PostsDto postsDto = postsService.deletePost(id, username);

        return ResponseEntity.status(HttpStatus.OK).body(postsDto);
    }

    // 내가 본 글 목록
    @GetMapping("/posts/read")
    public ResponseEntity<Page<PostsDto>> getMyWatchedPosts(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                            @RequestParam(defaultValue = "0") int page){

        int pageSize = 12;
        String username = userDetails.getUsername();
        Page<PostsDto> dtoPage = postsService.getMyWatchedPosts(page, pageSize, username);

        return ResponseEntity.status(HttpStatus.OK).body(dtoPage);
    }

    // 내가 좋아요 누른 글 목록
    @GetMapping("/posts/likes")
    public ResponseEntity<Page<PostsDto>> getMyLikePosts(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                         @RequestParam(defaultValue = "0") int page){

        int pageSize = 12;
        String username = userDetails.getUsername();
        Page<PostsDto> dtoPage = postsService.getMyLikePosts(page, pageSize, username);

        return ResponseEntity.status(HttpStatus.OK).body(dtoPage);
    }

    // 내가 쓴 글 목록
    @GetMapping("/posts/my")
    public ResponseEntity<Page<PostsDto>> getMyPosts(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                     @RequestParam(defaultValue = "0") int page){

        int pageSize = 12;
        String username = userDetails.getUsername();
        Page<PostsDto> dtoPage = postsService.getMyPosts(page, pageSize, username);

        return ResponseEntity.status(HttpStatus.OK).body(dtoPage);
    }

    // 제목으로 글 검색
    @GetMapping(value = "/posts/search", params = "title")
    public ResponseEntity<Page<PostsDto>> postsSearchByTitle(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(required = false) String title){

        int pageSize = 12;
        Page<PostsDto> dtoPage = postsService.getPostsByTitle(page, pageSize, title);

        return ResponseEntity.status(HttpStatus.OK).body(dtoPage);
    }

    // 닉네임으로 글 검색
    @GetMapping(value = "/posts/search", params = "nickname")
    public ResponseEntity<Page<PostsDto>> postsSearchByNickname(@RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(required = false) String nickname){

        int pageSize = 12;
        Page<PostsDto> dtoPage = postsService.getPostsByNickname(page, pageSize, nickname);

        return ResponseEntity.status(HttpStatus.OK).body(dtoPage);
    }

    // 내용으로 글 검색
    @GetMapping(value = "/posts/search", params = "content")
    public ResponseEntity<Page<PostsDto>> postsSearchByContent(@RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(required = false) String content){

        int pageSize = 12;
        Page<PostsDto> dtoPage = postsService.getPostsByContent(page, pageSize, content);

        return ResponseEntity.status(HttpStatus.OK).body(dtoPage);
    }

    // 태그 클릭으로 같은 태그 글 가져오기
    @GetMapping("/posts/search/{tagsId}")
    public ResponseEntity<Page<PostsDto>> postsSearchByTags(@RequestParam(defaultValue = "0") int page,
                                                            @PathVariable Long tagsId){

        int pageSize = 12;
        Page<PostsDto> dtoPage = postsService.getPostsByTags(page, pageSize, tagsId);

        return ResponseEntity.status(HttpStatus.OK).body(dtoPage);
    }

    // 최근 n일간 트렌딩 글 가져오기
    @GetMapping("/posts/trending")
    public ResponseEntity<Page<PostsDto>> getTrendingPosts(@RequestParam(defaultValue = "0") int page){

        int pageSize = 12;
        Page<PostsDto> dtoPage = postsService.getTrendingPosts(page, pageSize);

        return ResponseEntity.status(HttpStatus.OK).body(dtoPage);
    }

}
