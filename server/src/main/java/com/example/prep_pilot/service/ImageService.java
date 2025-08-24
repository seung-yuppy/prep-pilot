package com.example.prep_pilot.service;

import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.prep_pilot.config.S3Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class ImageService {

    private final S3Config s3Config;

    public ImageService(S3Config s3Config){

        this.s3Config = s3Config;
    }

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String imageUpload(MultipartRequest request) throws IOException {

        MultipartFile file = request.getFile("upload"); // upload 키 값을 가진 파일 꺼내기

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다.");
        }

        String fileName = file.getOriginalFilename();
        String ext = fileName.substring(fileName.indexOf(".")); // 확장자명

        String uuidFileName = UUID.randomUUID() + ext; // 파일이름 재정의

        // 메타데이터 설정
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        // S3에 업로드
        s3Config.amazonS3Client().putObject(
                new PutObjectRequest(bucket, uuidFileName, file.getInputStream(), metadata)
                        .withCannedAcl(CannedAccessControlList.PublicRead)
        );

        // S3에 저장된 URL 반환
        return s3Config.amazonS3Client().getUrl(bucket, uuidFileName).toString();
    }

    public void deleteImage(String imageUrl) {

        String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

        s3Config.amazonS3Client().deleteObject(bucket, fileName);
    }
}