package com.amazonClone.amazon.service.impl;

import com.amazonClone.amazon.dto.request.CategoryRequest;
import com.amazonClone.amazon.dto.request.ProductRequest;
import com.amazonClone.amazon.dto.response.*;
import com.amazonClone.amazon.entity.Category;
import com.amazonClone.amazon.entity.Product;
import com.amazonClone.amazon.entity.ProductImage;
import com.amazonClone.amazon.exception.ResourceNotFoundException;
import com.amazonClone.amazon.repository.CategoryRepository;
import com.amazonClone.amazon.repository.ProductImageRepository;
import com.amazonClone.amazon.repository.ProductRepository;
import com.amazonClone.amazon.service.ProductService;
import com.amazonClone.amazon.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final S3Service s3Service;

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .brand(request.getBrand())
                .category(category)
                .build();

        return mapToResponse(productRepository.save(product));
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToResponse(product);
    }

    @Override
    public PageResponse<ProductResponse> getAllProducts(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> productPage = productRepository.findAll(pageable);
        return mapToPageResponse(productPage);
    }

    @Override
    public PageResponse<ProductResponse> searchProducts(String name, Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Product> productPage = productRepository.findByFilters(name, categoryId, pageable);
        return mapToPageResponse(productPage);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setBrand(request.getBrand());
        product.setCategory(category);

        return mapToResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Delete images from S3
        product.getImages().forEach(img -> {
            if (img.getS3Key() != null) {
                s3Service.deleteFile(img.getS3Key());
            }
        });

        // Delete video from S3
        if (product.getVideoUrl() != null) {
            String videoKey = extractS3Key(product.getVideoUrl());
            if (videoKey != null) s3Service.deleteFile(videoKey);
        }

        productRepository.delete(product);
    }

    @Override
    @Transactional
    public ProductResponse uploadProductImages(Long productId, List<MultipartFile> images) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        boolean hasPrimary = !product.getImages().isEmpty();

        for (int i = 0; i < images.size(); i++) {
            MultipartFile file = images.get(i);
            String s3Key = s3Service.uploadFile(file, "products/images");
            String imageUrl = s3Service.getFileUrl(s3Key);

            ProductImage productImage = ProductImage.builder()
                    .imageUrl(imageUrl)
                    .s3Key(s3Key)
                    .isPrimary(!hasPrimary && i == 0)
                    .product(product)
                    .build();

            product.getImages().add(productImage);
        }

        return mapToResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductResponse uploadProductVideo(Long productId, MultipartFile video) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (product.getVideoUrl() != null) {
            String oldKey = extractS3Key(product.getVideoUrl());
            if (oldKey != null) s3Service.deleteFile(oldKey);
        }

        String s3Key = s3Service.uploadFile(video, "products/videos");
        product.setVideoUrl(s3Service.getFileUrl(s3Key));

        return mapToResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public void deleteProductImage(Long productId, Long imageId) {
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found with id: " + imageId));

        if (!image.getProduct().getId().equals(productId)) {
            throw new IllegalArgumentException("Image does not belong to the specified product");
        }

        if (image.getS3Key() != null) {
            s3Service.deleteFile(image.getS3Key());
        }

        productImageRepository.delete(image);
    }

    // --- Category methods ---

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Category already exists: " + request.getName());
        }
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        return mapToCategoryResponse(categoryRepository.save(category));
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return mapToCategoryResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        return mapToCategoryResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    // --- Mappers ---

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .brand(product.getBrand())
                .videoUrl(product.getVideoUrl())
                .category(mapToCategoryResponse(product.getCategory()))
                .images(product.getImages().stream()
                        .map(img -> ProductImageResponse.builder()
                                .id(img.getId())
                                .imageUrl(img.getImageUrl())
                                .isPrimary(img.getIsPrimary())
                                .build())
                        .collect(Collectors.toList()))
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    private CategoryResponse mapToCategoryResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }

    private PageResponse<ProductResponse> mapToPageResponse(Page<Product> page) {
        return PageResponse.<ProductResponse>builder()
                .content(page.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    private String extractS3Key(String url) {
        if (url == null) return null;
        int idx = url.indexOf(".amazonaws.com/");
        return idx >= 0 ? url.substring(idx + ".amazonaws.com/".length()) : null;
    }
}