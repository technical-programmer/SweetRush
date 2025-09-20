package com.project.tastySweets.controller;

import com.project.tastySweets.dto.SweetDto;
import com.project.tastySweets.modal.Sweet;
import com.project.tastySweets.service.SweetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sweets")
public class SweetController {

    private final SweetService sweetService;

    public SweetController(SweetService sweetService) {
        this.sweetService = sweetService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SweetDto> addSweet(@RequestBody Sweet sweet) {
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

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SweetDto> updateSweet(@PathVariable Long id, @RequestBody Sweet sweetDetails) {
        Sweet updatedSweet = sweetService.updateSweet(id, sweetDetails);
        return ResponseEntity.ok(convertToDto(updatedSweet));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSweet(@PathVariable Long id) {
        sweetService.deleteSweet(id);
        return ResponseEntity.noContent().build();
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