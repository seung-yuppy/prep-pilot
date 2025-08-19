package com.example.prep_pilot.service;

import com.example.prep_pilot.dto.TagsDto;
import com.example.prep_pilot.entity.Post_tags;
import com.example.prep_pilot.entity.Tags;
import com.example.prep_pilot.repository.Post_tagsRepository;
import com.example.prep_pilot.repository.TagsRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TagsService {

    private TagsRepository tagsRepository;
    private Post_tagsRepository postTagsRepository;

    public TagsService(TagsRepository tagsRepository, Post_tagsRepository postTagsRepository){

        this.tagsRepository = tagsRepository;
        this.postTagsRepository = postTagsRepository;
    }

    @Transactional
    public TagsDto addTags(TagsDto tagsDto) {

        String tagName = tagsDto.getName();
        if(tagsRepository.existsByName(tagName))
            return TagsDto.toDto(tagsRepository.findByName(tagName));
        else
            return TagsDto.toDto(tagsRepository.save(Tags.toEntity(tagsDto)));
    }

    public List<TagsDto> getTags(Long postsId) {

        List<Post_tags> list = postTagsRepository.findAllByPostsId(postsId);
        List<Tags> tags = new ArrayList<>();
        for(Post_tags p : list){
            tags.add(p.getTags());
        }

        return tags.stream().map(TagsDto::toDto).collect(Collectors.toList());
    }
}
