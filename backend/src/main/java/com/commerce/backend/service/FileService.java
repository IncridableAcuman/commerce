package com.commerce.backend.service;

import com.commerce.backend.exception.CustomBadRequestException;
import com.commerce.backend.exception.CustomInternalServerException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileService {
    @Value("file.upload.dir")
    private String uploadDir;

    public String saveFile(MultipartFile file){
        try {
            if (file == null || file.isEmpty()){
                throw new CustomBadRequestException("File is null or empty");}
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)){
                Files.createDirectories(uploadPath);}
            String originalName = file.getOriginalFilename();
            String extension = ".";
            if (originalName != null){
                extension = originalName.substring(originalName.indexOf("."));
            }
            String fileName = UUID.randomUUID() + extension;
            Path path = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(),path);
            return fileName;
        } catch (Exception e){
            throw new CustomInternalServerException();
        }
    }
    public void removeFile(String filename){
        if (filename == null || filename.isEmpty()){
            throw new CustomBadRequestException("Filename is null or empty");}
        try {
            Path path = Paths.get(uploadDir,filename);
            Files.deleteIfExists(path);
        } catch (IOException e){
            throw new CustomInternalServerException();
        }
    }
}
