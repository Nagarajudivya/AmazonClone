package com.amazonClone.amazon.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private Double rating;
    private Integer reviewCount;
    private String brand;
    private String videoUrl;
    private CategoryResponse category;
    private List<ProductImageResponse> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}