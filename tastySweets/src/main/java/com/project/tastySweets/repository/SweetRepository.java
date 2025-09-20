package com.project.tastySweets.repository;

import com.project.tastySweets.modal.Sweet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SweetRepository extends JpaRepository<Sweet, Long> {

    @Query("SELECT s FROM Sweet s WHERE " +
            "(:name IS NULL OR LOWER(s.name) LIKE CONCAT('%', LOWER(:name), '%')) AND " +
            "(:category IS NULL OR LOWER(s.category) LIKE CONCAT('%', LOWER(:category), '%')) AND " +
            "(:minPrice IS NULL OR s.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR s.price <= :maxPrice)")
    List<Sweet> searchSweets(
            @Param("name") String name,
            @Param("category") String category,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice
    );
}