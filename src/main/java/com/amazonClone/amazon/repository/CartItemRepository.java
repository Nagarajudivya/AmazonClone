package com.amazonClone.amazon.repository;

import com.amazonClone.amazon.entity.Cart;
import com.amazonClone.amazon.entity.CartItem;
import com.amazonClone.amazon.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}