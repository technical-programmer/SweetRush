//package com.project.tastySweets.service;
//
//import com.project.tastySweets.modal.Sweet;
//import java.util.List;
//
//public interface SweetService {
//    Sweet addSweet(Sweet sweet);
//    List<Sweet> getAllSweets();
//    Sweet updateSweet(Long id, Sweet sweetDetails);
//    Sweet purchaseSweet(Long id, int quantity);
//    void deleteSweet(Long id);
//    Sweet restockSweet(Long id, int quantity);
//    List<Sweet> searchSweets(String name, String category, Double minPrice, Double maxPrice);
//}

package com.project.tastySweets.service;

import com.project.tastySweets.modal.Sweet;
import java.util.List;

public interface SweetService {
    Sweet addSweet(Sweet sweet);
    List<Sweet> getAllSweets();
    Sweet getSweetById(Long id); // Add this method
    Sweet updateSweet(Long id, Sweet sweetDetails);
    Sweet purchaseSweet(Long id, int quantity);
    void deleteSweet(Long id);
    Sweet restockSweet(Long id, int quantity);
    List<Sweet> searchSweets(String name, String category, Double minPrice, Double maxPrice);
}