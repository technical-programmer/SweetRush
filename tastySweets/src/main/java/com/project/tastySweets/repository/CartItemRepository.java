package com.project.tastySweets.repository;

import com.project.tastySweets.modal.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    CartItem findByUserIdAndSweetId(Long userId, Long sweetId);

    List<CartItem> findByUserId(Long userId);
}