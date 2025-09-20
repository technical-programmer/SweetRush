package com.project.tastySweets.service;

import com.project.tastySweets.repository.SweetRepository;
import com.project.tastySweets.modal.Sweet;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class SweetServiceTest {

    @Mock
    private SweetRepository sweetRepository;

    @InjectMocks
    private SweetServiceImpl sweetService;

    private Sweet sweet;

    @BeforeEach
    void setUp() {
        sweet = new Sweet();
        sweet.setId(1L);
        sweet.setName("Chocolate Bar");
        sweet.setQuantity(10);
    }

    @Test
    void whenPurchaseSweet_thenQuantityDecrements() {
        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));
        when(sweetRepository.save(any(Sweet.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Sweet purchasedSweet = sweetService.purchaseSweet(1L, 1);

        assertEquals(9, purchasedSweet.getQuantity());
        verify(sweetRepository, times(1)).save(any(Sweet.class));
    }

    @Test
    void whenPurchaseMoreThanStock_thenThrowsException() {
        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));

        assertThrows(IllegalArgumentException.class, () -> sweetService.purchaseSweet(1L, 11));
    }

    @Test
    void whenPurchaseNonExistingSweet_thenThrowsException() {
        when(sweetRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> sweetService.purchaseSweet(2L, 1));
    }
}