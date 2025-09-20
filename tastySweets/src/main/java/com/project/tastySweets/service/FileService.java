package com.project.tastySweets.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileService {
    private final Path root = Paths.get("uploads");

    public FileService() {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    public String save(MultipartFile file) {
        try {
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0) {
                fileExtension = originalFilename.substring(dotIndex);
            }

            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            Path filePath = this.root.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath);

            return "/uploads/" + uniqueFilename;
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }
}