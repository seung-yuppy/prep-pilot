package com.example.prep_pilot.controller;

import com.example.prep_pilot.dto.TagCountDto;
import com.example.prep_pilot.dto.TagsDto;
import com.example.prep_pilot.entity.Tags;
import com.example.prep_pilot.service.TagsService;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TagsController {

    private final TagsService tagsService;

    public TagsController(TagsService tagsService){

        this.tagsService = tagsService;
    }

    // 태그 등록
    @PostMapping("/tags")
    public ResponseEntity<TagsDto> postTags(@RequestBody TagsDto tagsDto){

        TagsDto dto = tagsService.addTags(tagsDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    // 태그 삭제
    @DeleteMapping("/tags/{postsId}/{id}")
    public ResponseEntity<TagsDto> deleteTags(@PathVariable Long postsId,
                                              @PathVariable Long id){

        TagsDto dto = tagsService.deleteTags(postsId, id);

        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }

    // 해당 글의 태그리스트
    @GetMapping("/{postsId}/tags")
    public ResponseEntity<List<TagsDto>> getTags(@PathVariable Long postsId){

        List<TagsDto> list = tagsService.getTags(postsId);

        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    // 해당 userId가 쓴 태그 목록
    @GetMapping("/tags/{userId}")
    public ResponseEntity<List<TagCountDto>> getTagsCount(@PathVariable Long userId){

        List<TagCountDto> list = tagsService.getTagsCount(userId);

        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

}
