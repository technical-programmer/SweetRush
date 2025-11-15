//package com.project.tastySweets.controller;
//
//import com.project.tastySweets.dto.SweetDto;
//import com.project.tastySweets.modal.Sweet;
//import com.project.tastySweets.service.FileService;
//import com.project.tastySweets.service.SweetService;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@RestController
//@RequestMapping("/api/sweets")
//public class SweetController {
//    private final FileService fileService;
//    private final SweetService sweetService;
//
//    public SweetController(FileService fileService, SweetService sweetService) {
//        this.fileService = fileService;
//        this.sweetService = sweetService;
//    }
//
//
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @PostMapping("/upload-image")
//    public String uploadImage(@RequestParam("file") MultipartFile file) {
//        return fileService.save(file);
//    }
//
//    @PostMapping
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<SweetDto> addSweet(@RequestBody Sweet sweet) {
//        Sweet newSweet = sweetService.addSweet(sweet);
//        return new ResponseEntity<>(convertToDto(newSweet), HttpStatus.CREATED);
//    }
//
//    @GetMapping
//    public ResponseEntity<List<SweetDto>> getAllSweets() {
//        List<Sweet> sweets = sweetService.getAllSweets();
//        List<SweetDto> sweetDtos = sweets.stream()
//                .map(this::convertToDto)
//                .collect(Collectors.toList());
//        return ResponseEntity.ok(sweetDtos);
//    }
//
//    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<SweetDto> updateSweet(@PathVariable Long id, @RequestBody Sweet sweetDetails) {
//        Sweet updatedSweet = sweetService.updateSweet(id, sweetDetails);
//        return ResponseEntity.ok(convertToDto(updatedSweet));
//    }
//
//    @DeleteMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<Void> deleteSweet(@PathVariable Long id) {
//        sweetService.deleteSweet(id);
//        return ResponseEntity.noContent().build();
//    }
//
//    @PostMapping("/{id}/purchase")
//    public ResponseEntity<SweetDto> purchaseSweet(@PathVariable Long id) {
//        Sweet updatedSweet = sweetService.purchaseSweet(id, 1);
//        return ResponseEntity.ok(convertToDto(updatedSweet));
//    }
//
//    @PostMapping("/{id}/restock")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<SweetDto> restockSweet(@PathVariable Long id, @RequestBody int quantity) {
//        Sweet updatedSweet = sweetService.restockSweet(id, quantity);
//        return ResponseEntity.ok(convertToDto(updatedSweet));
//    }
//
//    @GetMapping("/search")
//    public ResponseEntity<List<SweetDto>> searchSweets(
//            @RequestParam(required = false) String name,
//            @RequestParam(required = false) String category,
//            @RequestParam(required = false) Double minPrice,
//            @RequestParam(required = false) Double maxPrice
//    ) {
//        List<Sweet> searchResults = sweetService.searchSweets(name, category, minPrice, maxPrice);
//        List<SweetDto> sweetDtos = searchResults.stream()
//                .map(this::convertToDto)
//                .collect(Collectors.toList());
//        return ResponseEntity.ok(sweetDtos);
//    }
//
//    private SweetDto convertToDto(Sweet sweet) {
//        SweetDto sweetDto = new SweetDto();
//        sweetDto.setId(sweet.getId());
//        sweetDto.setName(sweet.getName());
//        sweetDto.setCategory(sweet.getCategory());
//        sweetDto.setPrice(sweet.getPrice());
//        sweetDto.setQuantity(sweet.getQuantity());
//        sweetDto.setImageUrl(sweet.getImageUrl());
//        return sweetDto;
//    }
//}

package com.project.tastySweets.controller;

import com.project.tastySweets.dto.SweetDto;
import com.project.tastySweets.modal.Sweet;
import com.project.tastySweets.service.ImageService;
import com.project.tastySweets.service.SweetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sweets")
@CrossOrigin(origins = "*") // Configure properly for production
public class SweetController {
    private final ImageService imageService;
    private final SweetService sweetService;

    public SweetController(ImageService imageService, SweetService sweetService) {
        this.imageService = imageService;
        this.sweetService = sweetService;
    }

    // Upload image and return Cloudinary URL
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = imageService.uploadImage(file);
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload image: " + e.getMessage());
        }
    }

    // Add sweet with image upload in one request
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addSweet(
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("price") double price,
            @RequestParam("quantity") int quantity,
            @RequestParam("image") MultipartFile image) {
        try {
            // Upload image to Cloudinary
            String imageUrl = imageService.uploadImage(image);

            // Create sweet object
            Sweet sweet = new Sweet();
            sweet.setName(name);
            sweet.setCategory(category);
            sweet.setPrice(price);
            sweet.setQuantity(quantity);
            sweet.setImageUrl(imageUrl); // Store full Cloudinary URL

            // Save to database
            Sweet newSweet = sweetService.addSweet(sweet);
            return new ResponseEntity<>(convertToDto(newSweet), HttpStatus.CREATED);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add sweet: " + e.getMessage());
        }
    }

    // Alternative: Add sweet with JSON body (imageUrl already uploaded)
    @PostMapping("/with-url")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SweetDto> addSweetWithUrl(@RequestBody Sweet sweet) {
        Sweet newSweet = sweetService.addSweet(sweet);
        return new ResponseEntity<>(convertToDto(newSweet), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SweetDto>> getAllSweets() {
        List<Sweet> sweets = sweetService.getAllSweets();
        List<SweetDto> sweetDtos = sweets.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(sweetDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SweetDto> getSweetById(@PathVariable Long id) {
        Sweet sweet = sweetService.getSweetById(id);
        return ResponseEntity.ok(convertToDto(sweet));
    }

    // Update sweet with new image
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSweet(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("price") double price,
            @RequestParam("quantity") int quantity,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Sweet existingSweet = sweetService.getSweetById(id);

            // If new image is provided, upload it and delete old one
            if (image != null && !image.isEmpty()) {
                // Delete old image from Cloudinary
                imageService.deleteImage(existingSweet.getImageUrl());

                // Upload new image
                String newImageUrl = imageService.uploadImage(image);
                existingSweet.setImageUrl(newImageUrl);
            }

            // Update other fields
            existingSweet.setName(name);
            existingSweet.setCategory(category);
            existingSweet.setPrice(price);
            existingSweet.setQuantity(quantity);

            Sweet updatedSweet = sweetService.updateSweet(id, existingSweet);
            return ResponseEntity.ok(convertToDto(updatedSweet));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update sweet: " + e.getMessage());
        }
    }

    // Alternative: Update with JSON body (no image change)
    @PutMapping("/{id}/details")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SweetDto> updateSweetDetails(@PathVariable Long id, @RequestBody Sweet sweetDetails) {
        Sweet updatedSweet = sweetService.updateSweet(id, sweetDetails);
        return ResponseEntity.ok(convertToDto(updatedSweet));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteSweet(@PathVariable Long id) {
        try {
            Sweet sweet = sweetService.getSweetById(id);

            // Delete image from Cloudinary
            imageService.deleteImage(sweet.getImageUrl());

            // Delete from database
            sweetService.deleteSweet(id);

            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete sweet: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/purchase")
    public ResponseEntity<SweetDto> purchaseSweet(@PathVariable Long id) {
        Sweet updatedSweet = sweetService.purchaseSweet(id, 1);
        return ResponseEntity.ok(convertToDto(updatedSweet));
    }

    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SweetDto> restockSweet(@PathVariable Long id, @RequestBody int quantity) {
        Sweet updatedSweet = sweetService.restockSweet(id, quantity);
        return ResponseEntity.ok(convertToDto(updatedSweet));
    }

    @GetMapping("/search")
    public ResponseEntity<List<SweetDto>> searchSweets(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        List<Sweet> searchResults = sweetService.searchSweets(name, category, minPrice, maxPrice);
        List<SweetDto> sweetDtos = searchResults.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(sweetDtos);
    }

    private SweetDto convertToDto(Sweet sweet) {
        SweetDto sweetDto = new SweetDto();
        sweetDto.setId(sweet.getId());
        sweetDto.setName(sweet.getName());
        sweetDto.setCategory(sweet.getCategory());
        sweetDto.setPrice(sweet.getPrice());
        sweetDto.setQuantity(sweet.getQuantity());
        sweetDto.setImageUrl(sweet.getImageUrl());
        return sweetDto;
    }
}