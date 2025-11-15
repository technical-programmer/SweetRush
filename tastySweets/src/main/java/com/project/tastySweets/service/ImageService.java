package com.project.tastySweets.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IOException("File is empty");
        }

        // Upload to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "tastySweets",
                        "resource_type", "auto"
                ));

        // Return the secure URL (full Cloudinary URL)
        return (String) uploadResult.get("secure_url");
    }

    public void deleteImage(String imageUrl) throws IOException {
        if (imageUrl == null || imageUrl.isEmpty() || !imageUrl.contains("cloudinary")) {
            return; // Skip if not a Cloudinary URL
        }

        String publicId = extractPublicId(imageUrl);
        if (publicId != null) {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        }
    }

    private String extractPublicId(String imageUrl) {
        try {
            // Extract public_id from Cloudinary URL
            // Example: https://res.cloudinary.com/xxx/image/upload/v123/tastySweets/image.jpg
            // public_id should be: tastySweets/image
            String[] parts = imageUrl.split("/upload/");
            if (parts.length > 1) {
                String path = parts[1];
                // Remove version number if present (v123456789/)
                if (path.matches("^v\\d+/.*")) {
                    path = path.substring(path.indexOf("/") + 1);
                }
                // Remove file extension
                int lastDot = path.lastIndexOf(".");
                if (lastDot > 0) {
                    path = path.substring(0, lastDot);
                }
                return path;
            }
        } catch (Exception e) {
            System.err.println("Error extracting public_id: " + e.getMessage());
        }
        return null;
    }
}