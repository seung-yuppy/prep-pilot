package com.example.prep_pilot.controller;

import com.example.prep_pilot.dto.CommentDto;
import com.example.prep_pilot.dto.CustomUserDetails;
import com.example.prep_pilot.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService){

        this.commentService = commentService;
    }

    // 해당 id 포스트 댓글 보기
    @GetMapping("/{postsId}/comment")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable Long postsId){

        List<CommentDto> comments = commentService.getComments(postsId);

        return ResponseEntity.status(HttpStatus.OK).body(comments);
    }

    // 해당 id 포스트에 댓글 생성
    @PostMapping("/{postsId}/comment")
    public ResponseEntity<CommentDto> createComment(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                    @PathVariable Long postsId,
                                                    @RequestBody CommentDto commentDto){

        String username = userDetails.getUsername();
        CommentDto comment = commentService.createComment(username, postsId, commentDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    // 해당 id 포스트 해당 댓글 id에 답글 생성
    @PostMapping("/{postsId}/{parentId}/comment")
    public ResponseEntity<CommentDto> createReply(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                  @PathVariable Long postsId,
                                                  @PathVariable Long parentId,
                                                  @RequestBody CommentDto commentDto){

        String username = userDetails.getUsername();
        CommentDto reply = commentService.createReply(username, postsId, parentId, commentDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(reply);
    }

    // 해당 id 댓글 수정
    @PatchMapping("/{id}/comment")
    public ResponseEntity<CommentDto> updateComment(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                    @PathVariable Long id,
                                                    @RequestBody CommentDto commentDto){

        String username = userDetails.getUsername();
        CommentDto updated = commentService.updateComment(username, id, commentDto);

        return ResponseEntity.status(HttpStatus.OK).body(updated);
    }

    // 해당 id 댓글 삭제
    @DeleteMapping("/{id}/comment")
    public ResponseEntity<CommentDto> deleteComment(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                    @PathVariable Long id){

        String username = userDetails.getUsername();
        CommentDto deleted = commentService.deleteComment(username, id);

        return ResponseEntity.status(HttpStatus.OK).body(deleted);
    }
}
