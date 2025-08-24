package com.example.prep_pilot.controller;

import com.example.prep_pilot.service.ImageService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartRequest;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService){

        this. imageService = imageService;
    }

    @PostMapping("/image/upload")
    public Map<String, Object> imageUpload(MultipartRequest request) {

        Map<String, Object> responseData = new HashMap<>();

        try {

            String s3Url = imageService.imageUpload(request);
            responseData.put("uploaded", true);
            responseData.put("url", s3Url);

            return responseData;

        } catch (IOException e) {

            responseData.put("uploaded", false);

            return responseData;

        }

    }

    @DeleteMapping("/image/delete")
    public Map<String, Object> deleteImage(@RequestParam String imageUrl) {
        Map<String, Object> responseData = new HashMap<>();

        try {
            imageService.deleteImage(imageUrl);
            responseData.put("deleted", true);
        } catch (Exception e) {
            responseData.put("deleted", false);
            responseData.put("error", e.getMessage());
        }

        return responseData;
    }
}
