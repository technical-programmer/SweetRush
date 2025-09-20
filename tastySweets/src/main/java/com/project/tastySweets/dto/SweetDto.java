package com.project.tastySweets.dto;
import lombok.Data;

@Data
public class SweetDto {
    private Long id;
    private String name;
    private String category;
    private double price;
    private int quantity;
    private String imageUrl;
}