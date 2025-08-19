package com.example.prep_pilot.controller;

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

}
