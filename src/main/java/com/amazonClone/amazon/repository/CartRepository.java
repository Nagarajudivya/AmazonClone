package com.amazonClone.amazon.repository;

import com.amazonClone.amazon.entity.Cart;
import com.amazonClone.amazon.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUser(User user);

    boolean existsByUser(User user);
}