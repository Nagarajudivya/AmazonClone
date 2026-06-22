package com.amazonClone.amazon.controller;

import com.amazonClone.amazon.dto.response.ApiResponse;
import com.amazonClone.amazon.dto.response.StatsResponse;
import com.amazonClone.amazon.repository.CategoryRepository;
import com.amazonClone.amazon.repository.ProductRepository;
import com.amazonClone.amazon.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    /**
     * GET /api/v1/admin/stats
     * Dashboard summary card data.
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<StatsResponse>> getStats() {
        StatsResponse stats = StatsResponse.builder()
                .totalProducts(productRepository.count())
                .totalUsers(userRepository.count())
                .totalCategories(categoryRepository.count())
                .lowStockProducts(productRepository.countByStockQuantityLessThan(10))
                .build();

        return ResponseEntity.ok(ApiResponse.success("Stats fetched", stats));
    }
}