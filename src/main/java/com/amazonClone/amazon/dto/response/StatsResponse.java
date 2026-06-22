package com.amazonClone.amazon.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsResponse {
    private long totalProducts;
    private long totalUsers;
    private long totalCategories;
    private long lowStockProducts;   // stockQuantity < 10
}