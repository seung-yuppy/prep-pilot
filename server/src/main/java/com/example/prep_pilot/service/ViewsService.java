package com.example.prep_pilot.service;

import com.example.prep_pilot.dto.ViewsDto;
import com.example.prep_pilot.repository.ViewsRepository;
import org.springframework.stereotype.Service;

@Service
public class ViewsService {

    private final ViewsRepository viewsRepository;

    public ViewsService(ViewsRepository viewsRepository){

        this.viewsRepository = viewsRepository;
    }

    public ViewsDto getMyViews(String username) {

        return new ViewsDto();
    }
}
