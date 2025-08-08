package com.example.prep_pilot.controller;

import com.example.prep_pilot.dto.CustomUserDetails;
import com.example.prep_pilot.dto.ViewsDto;
import com.example.prep_pilot.service.ViewsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ViewsController {

    private final ViewsService viewsService;

    public ViewsController(ViewsService viewsService){

        this.viewsService = viewsService;
    }

    @GetMapping("/views")
    public ResponseEntity<ViewsDto> getViews(@AuthenticationPrincipal CustomUserDetails userDetails){

        String username = userDetails.getUsername();
        ViewsDto viewsDto = viewsService.getMyViews(username);

        return ResponseEntity.status(HttpStatus.OK).body(viewsDto);
    }
}
