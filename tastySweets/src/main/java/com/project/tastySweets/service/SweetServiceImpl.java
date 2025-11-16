//package com.project.tastySweets.service;
//
//import com.project.tastySweets.repository.SweetRepository;
//import com.project.tastySweets.modal.Sweet;
//import jakarta.persistence.EntityNotFoundException;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import java.util.List;
//
//@Service
//public class SweetServiceImpl implements SweetService {
//
//    private final SweetRepository sweetRepository;
//
//    public SweetServiceImpl(SweetRepository sweetRepository) {
//        this.sweetRepository = sweetRepository;
//    }
//
//    @Override
//    public Sweet addSweet(Sweet sweet) {
//        return sweetRepository.save(sweet);
//    }
//
//    @Override
//    public Sweet updateSweet(Long id, Sweet sweetDetails) {
//        Sweet sweet = sweetRepository.findById(id)
//                .orElseThrow(() -> new EntityNotFoundException("Sweet not found"));
//        sweet.setName(sweetDetails.getName());
//        sweet.setCategory(sweetDetails.getCategory());
//        sweet.setPrice(sweetDetails.getPrice());
//        sweet.setQuantity(sweetDetails.getQuantity());
//        sweet.setImageUrl(sweetDetails.getImageUrl());
//        return sweetRepository.save(sweet);
//    }
//
//    @Override
//    @Transactional
//    public Sweet purchaseSweet(Long id, int quantity) {
//        Sweet sweet = sweetRepository.findById(id)
//                .orElseThrow(() -> new EntityNotFoundException("Sweet not found"));
//        if (sweet.getQuantity() < quantity) {
//            throw new IllegalArgumentException("Not enough stock.");
//        }
//        sweet.setQuantity(sweet.getQuantity() - quantity);
//        return sweetRepository.save(sweet);
//    }
//
//    @Override
//    public List<Sweet> getAllSweets() {
//        return sweetRepository.findAll();
//    }
//
//    @Override
//    public void deleteSweet(Long id) {
//        sweetRepository.deleteById(id);
//    }
//
//    @Override
//    @Transactional
//    public Sweet restockSweet(Long id, int quantity) {
//        Sweet sweet = sweetRepository.findById(id)
//                .orElseThrow(() -> new EntityNotFoundException("Sweet not found"));
//        sweet.setQuantity(sweet.getQuantity() + quantity);
//        return sweetRepository.save(sweet);
//    }
//
//    @Override
//    public List<Sweet> searchSweets(String name, String category, Double minPrice, Double maxPrice) {
//        return sweetRepository.searchSweets(name, category, minPrice, maxPrice);
//    }
//}

package com.project.tastySweets.service;

import com.project.tastySweets.modal.Sweet;
import com.project.tastySweets.repository.SweetRepository;
import com.project.tastySweets.service.SweetService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SweetServiceImpl implements SweetService {

    private final SweetRepository sweetRepository;

    public SweetServiceImpl(SweetRepository sweetRepository) {
        this.sweetRepository = sweetRepository;
    }

    @Override
    public Sweet addSweet(Sweet sweet) {
        return sweetRepository.save(sweet);
    }

    @Override
    public List<Sweet> getAllSweets() {
        return sweetRepository.findAll();
    }

    @Override
    public Sweet getSweetById(Long id) {
        return sweetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sweet not found with id: " + id));
    }

    @Override
    public Sweet updateSweet(Long id, Sweet sweetDetails) {
        Sweet sweet = getSweetById(id);
        sweet.setName(sweetDetails.getName());
        sweet.setCategory(sweetDetails.getCategory());
        sweet.setPrice(sweetDetails.getPrice());
        sweet.setQuantity(sweetDetails.getQuantity());
        if (sweetDetails.getImageUrl() != null) {
            sweet.setImageUrl(sweetDetails.getImageUrl());
        }
        return sweetRepository.save(sweet);
    }

    @Override
    public Sweet purchaseSweet(Long id, int quantity) {
        Sweet sweet = getSweetById(id);
        if (sweet.getQuantity() < quantity) {
            throw new RuntimeException("Not enough stock");
        }
        sweet.setQuantity(sweet.getQuantity() - quantity);
        return sweetRepository.save(sweet);
    }

    @Override
    public void deleteSweet(Long id) {
        Sweet sweet = getSweetById(id);
        sweetRepository.delete(sweet);
    }

    @Override
    public Sweet restockSweet(Long id, int quantity) {
        Sweet sweet = getSweetById(id);
        sweet.setQuantity(sweet.getQuantity() + quantity);
        return sweetRepository.save(sweet);
    }

    @Override
    public List<Sweet> searchSweets(String name, String category, Double minPrice, Double maxPrice) {
        return sweetRepository.searchSweets(name, category, minPrice, maxPrice);
    }
}