package com.amazonClone.amazon.controller;

import com.amazonClone.amazon.dto.request.AddToCartRequest;
import com.amazonClone.amazon.dto.request.UpdateCartItemRequest;
import com.amazonClone.amazon.dto.response.ApiResponse;
import com.amazonClone.amazon.dto.response.CartResponse;
import com.amazonClone.amazon.entity.User;
import com.amazonClone.amazon.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(
            @AuthenticationPrincipal User user) {

        CartResponse cart = cartService.getCart(user);
        return ResponseEntity.ok(ApiResponse.success("Cart fetched successfully", cart));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddToCartRequest request) {

        CartResponse cart = cartService.addToCart(user, request);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cart));
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request) {

        CartResponse cart = cartService.updateCartItem(user, cartItemId, request);
        return ResponseEntity.ok(ApiResponse.success("Cart item updated", cart));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeCartItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long cartItemId) {

        CartResponse cart = cartService.removeCartItem(user, cartItemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cart));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<CartResponse>> clearCart(
            @AuthenticationPrincipal User user) {

        CartResponse cart = cartService.clearCart(user);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", cart));
    }
}