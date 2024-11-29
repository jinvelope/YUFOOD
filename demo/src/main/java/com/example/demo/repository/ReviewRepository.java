package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByRestaurantRid(Integer rid);
    
    @Query("SELECT r, u.username FROM Review r LEFT JOIN User u ON r.userid = u.id WHERE r.restaurant.rid = :rid")
    List<Object[]> findByRestaurantRidWithUsername(@Param("rid") Integer rid);
}