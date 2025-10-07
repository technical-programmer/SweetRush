package com.project.tastySweets.controller;

import com.project.tastySweets.dto.AddToCartRequest;
import com.project.tastySweets.dto.UpdateCartItemRequest;
import com.project.tastySweets.modal.CartItem;
import com.project.tastySweets.modal.User;
import com.project.tastySweets.repository.UserRepository;
import com.project.tastySweets.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<Void> addToCart(@RequestBody AddToCartRequest request, Principal principal) {
        String username = principal.getName();
        User user = userRepository.findByUsername(username);

        cartService.addItemToCart(user.getId(), request.getSweetId(), request.getQuantity());
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCartItems(Principal principal) {
        String username = principal.getName();
        User user = userRepository.findByUsername(username);
        List<CartItem> cartItems = cartService.getCartItems(user.getId());
        return ResponseEntity.ok(cartItems);
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<Void> updateCartItem(@PathVariable Long cartItemId, @RequestBody UpdateCartItemRequest request) {
        cartService.updateCartItem(cartItemId, request.getQuantity());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeCartItem(@PathVariable Long cartItemId){
        cartService.removeCartItem(cartItemId);
        return ResponseEntity.ok().build();
    }
}