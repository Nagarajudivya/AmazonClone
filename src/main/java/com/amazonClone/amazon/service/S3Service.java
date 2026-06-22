package com.amazonClone.amazon.service;

import org.springframework.web.multipart.MultipartFile;

public interface S3Service {
    String uploadFile(MultipartFile file, String folder);
    void deleteFile(String s3Key);
    String getFileUrl(String s3Key);
}