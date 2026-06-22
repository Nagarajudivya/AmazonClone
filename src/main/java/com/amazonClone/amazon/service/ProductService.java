package com.amazonClone.amazon.service;

import com.amazonClone.amazon.dto.request.CategoryRequest;
import com.amazonClone.amazon.dto.request.ProductRequest;
import com.amazonClone.amazon.dto.response.CategoryResponse;
import com.amazonClone.amazon.dto.response.PageResponse;
import com.amazonClone.amazon.dto.response.ProductResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductRequest request);
    ProductResponse getProductById(Long id);
    PageResponse<ProductResponse> getAllProducts(int page, int size, String sortBy, String sortDir);
    PageResponse<ProductResponse> searchProducts(String name, Long categoryId, int page, int size);
    ProductResponse updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
    ProductResponse uploadProductImages(Long productId, List<MultipartFile> images);
    ProductResponse uploadProductVideo(Long productId, MultipartFile video);
    void deleteProductImage(Long productId, Long imageId);

    CategoryResponse createCategory(CategoryRequest request);
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(Long id);
    CategoryResponse updateCategory(Long id, CategoryRequest request);
    void deleteCategory(Long id);
}