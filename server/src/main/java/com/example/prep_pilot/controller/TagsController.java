package com.example.prep_pilot.controller;

import com.example.prep_pilot.dto.TagCountDto;
import com.example.prep_pilot.dto.TagsDto;
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

    @PostMapping("/tags")
    public ResponseEntity<TagsDto> postTags(@RequestBody TagsDto tagsDto){

        TagsDto dto = tagsService.addTags(tagsDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

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
