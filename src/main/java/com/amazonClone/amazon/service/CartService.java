package com.amazonClone.amazon.service;

import com.amazonClone.amazon.dto.request.AddToCartRequest;
import com.amazonClone.amazon.dto.request.UpdateCartItemRequest;
import com.amazonClone.amazon.dto.response.CartResponse;
import com.amazonClone.amazon.entity.User;

public interface CartService {

    CartResponse getCart(User user);

    CartResponse addToCart(User user, AddToCartRequest request);

    CartResponse updateCartItem(User user, Long cartItemId, UpdateCartItemRequest request);

    CartResponse removeCartItem(User user, Long cartItemId);

    CartResponse clearCart(User user);
}