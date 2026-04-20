package com.commerce.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileService {
    @Value("${file.upload.dir}")
    private String uploadDir;

    public String saveFile(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)){
            Files.createDirectories(uploadPath);
        }

        String originalName = file.getOriginalFilename();
        String extension=".";

        if (originalName != null && originalName.contains(".")){
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        String generatedFilename = UUID.randomUUID() + extension;

        Path filePath = uploadPath.resolve(generatedFilename);

        Files.copy(file.getInputStream(),filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/"+generatedFilename;
    }
}
