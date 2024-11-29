package com.example.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.Restaurant;
import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {

    @Query("SELECT DISTINCT r FROM Restaurant r LEFT JOIN FETCH r.menus WHERE r.rtag = :category")
    List<Restaurant> findByCategory(@Param("category") String category);

    @Query("SELECT DISTINCT r FROM Restaurant r LEFT JOIN FETCH r.menus")
    List<Restaurant> findAllWithMenus();

    List<Restaurant> findTop10ByRtagOrderByRstarDesc(String rtag);

    List<Restaurant> findTop10ByRtagAndRlocOrderByRstarDesc(String rtag, String rloc);

    Page<Restaurant> findByRtagAndRloc(String rtag, String rloc, Pageable pageable);
    
    @Query("SELECT r FROM Restaurant r " +
            "JOIN Keyword k ON r.keyword1 = k.kid " +
            "OR r.keyword2 = k.kid " +
            "OR r.keyword3 = k.kid " +
            "OR r.keyword4 = k.kid " +
            "WHERE k.keyword LIKE %:searchTerm% or r.rtag LIKE %:searchTerm% or r.rname LIKE %:searchTerm%")
     List<Restaurant> searchByKeywordOrRname(@Param("searchTerm") String searchTerm);
}
