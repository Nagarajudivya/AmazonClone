package com.amazonClone.amazon.service.impl;

import com.amazonClone.amazon.exception.S3UploadException;
import com.amazonClone.amazon.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    @Override
    public String uploadFile(MultipartFile file, String folder) {
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String s3Key = folder + "/" + UUID.randomUUID() + extension;

        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();

            s3Client.putObject(putRequest, RequestBody.fromBytes(file.getBytes()));
            return s3Key;
        } catch (IOException e) {
            throw new S3UploadException("Failed to upload file to S3: " + e.getMessage());
        }
    }

    @Override
    public void deleteFile(String s3Key) {
        try {
            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .build();
            s3Client.deleteObject(deleteRequest);
        } catch (Exception e) {
            throw new S3UploadException("Failed to delete file from S3: " + e.getMessage());
        }
    }

    @Override
    public String getFileUrl(String s3Key) {
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, s3Key);
    }
}