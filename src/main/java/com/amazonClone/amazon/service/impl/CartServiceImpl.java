package com.amazonClone.amazon.service.impl;

import com.amazonClone.amazon.dto.request.AddToCartRequest;
import com.amazonClone.amazon.dto.request.UpdateCartItemRequest;
import com.amazonClone.amazon.dto.response.CartItemResponse;
import com.amazonClone.amazon.dto.response.CartResponse;
import com.amazonClone.amazon.entity.Cart;
import com.amazonClone.amazon.entity.CartItem;
import com.amazonClone.amazon.entity.Product;
import com.amazonClone.amazon.entity.User;
import com.amazonClone.amazon.exception.CartItemNotFoundException;
import com.amazonClone.amazon.exception.InsufficientStockException;
import com.amazonClone.amazon.exception.ResourceNotFoundException;
import com.amazonClone.amazon.repository.CartItemRepository;
import com.amazonClone.amazon.repository.CartRepository;
import com.amazonClone.amazon.repository.ProductRepository;
import com.amazonClone.amazon.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    // ── helpers ───────────────────────────────────────────────────────────────

    /** Gets or creates the user's cart. */
    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = Cart.builder().user(user).build();
            return cartRepository.save(newCart);
        });
    }

    /** Maps a Cart entity → CartResponse DTO. */
    private CartResponse toCartResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(this::toCartItemResponse)
                .toList();

        return CartResponse.builder()
                .id(cart.getId())
                .items(itemResponses)
                .totalAmount(cart.getTotalAmount())
                .totalItems(cart.getTotalItems())
                .build();
    }

    /** Maps a CartItem entity → CartItemResponse DTO. */
    private CartItemResponse toCartItemResponse(CartItem item) {
        Product p = item.getProduct();
        String imageUrl = p.getImages().stream()
                .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                .findFirst()
                .map(img -> img.getImageUrl())
                .orElseGet(() -> p.getImages().isEmpty() ? null : p.getImages().get(0).getImageUrl());

        return CartItemResponse.builder()
                .id(item.getId())
                .productId(p.getId())
                .productName(p.getName())
                .productBrand(p.getBrand())
                .productImageUrl(imageUrl)
                .stockQuantity(p.getStockQuantity())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .subtotal(item.getSubtotal())
                .build();
    }

    /** Ensures the CartItem belongs to the logged-in user's cart. */
    private CartItem getOwnedCartItem(User user, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new CartItemNotFoundException("Cart item not found with id: " + cartItemId));
        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new CartItemNotFoundException("Cart item not found with id: " + cartItemId);
        }
        return item;
    }

    // ── public API ────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(User user) {
        Cart cart = getOrCreateCart(user);
        return toCartResponse(cart);
    }

    @Override
    public CartResponse addToCart(User user, AddToCartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        Cart cart = getOrCreateCart(user);

        // Check if product already in cart
        Optional<CartItem> existingItem = cartItemRepository.findByCartAndProduct(cart, product);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQty = item.getQuantity() + request.getQuantity();

            if (newQty > product.getStockQuantity()) {
                throw new InsufficientStockException(
                        "Only " + product.getStockQuantity() + " units available. You already have "
                                + item.getQuantity() + " in your cart.");
            }

            item.setQuantity(newQty);
            item.recalculateSubtotal();
            cartItemRepository.save(item);
        } else {
            if (request.getQuantity() > product.getStockQuantity()) {
                throw new InsufficientStockException(
                        "Only " + product.getStockQuantity() + " units available.");
            }

            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .price(product.getPrice())
                    .subtotal(product.getPrice())   // will be recalculated in @PrePersist
                    .build();
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        cart.recalculate();
        cartRepository.save(cart);
        return toCartResponse(cart);
    }

    @Override
    public CartResponse updateCartItem(User user, Long cartItemId, UpdateCartItemRequest request) {
        CartItem item = getOwnedCartItem(user, cartItemId);
        Cart cart = item.getCart();

        if (request.getQuantity() == 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            Product product = item.getProduct();
            if (request.getQuantity() > product.getStockQuantity()) {
                throw new InsufficientStockException(
                        "Only " + product.getStockQuantity() + " units available.");
            }
            item.setQuantity(request.getQuantity());
            item.recalculateSubtotal();
            cartItemRepository.save(item);
        }

        cart.recalculate();
        cartRepository.save(cart);
        return toCartResponse(cart);
    }

    @Override
    public CartResponse removeCartItem(User user, Long cartItemId) {
        CartItem item = getOwnedCartItem(user, cartItemId);
        Cart cart = item.getCart();

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        cart.recalculate();
        cartRepository.save(cart);
        return toCartResponse(cart);
    }

    @Override
    public CartResponse clearCart(User user) {
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cart.recalculate();
        cartRepository.save(cart);
        return toCartResponse(cart);
    }
}