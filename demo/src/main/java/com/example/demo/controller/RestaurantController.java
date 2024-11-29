package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.*;
import com.example.demo.entity.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/yufood")
@CrossOrigin(origins = "http://localhost:3000")
public class RestaurantController {
    @Autowired
    private RestaurantService restaurantService;

//    @GetMapping("/category/{category}")
//    public ResponseEntity<List<Restaurant>> getRestaurantsByCategory(
//            @PathVariable("category") String category) {
//        String decodedCategory = URLDecoder.decode(category, StandardCharsets.UTF_8);
//        List<Restaurant> restaurants = restaurantService.getRestaurantsByCategory(decodedCategory);
//        return new ResponseEntity<>(restaurants, HttpStatus.OK);
//    }

    @GetMapping("/category/{rtag}")
    public List<Restaurant> getTop10RestaurantsByCategory(@PathVariable("rtag") String rtag) {
        return restaurantService.getTop10RestaurantsByCategory(rtag);
    }
    @GetMapping("/category/{rtag}/location/{rloc}")
    public ResponseEntity<List<Restaurant>> getRestaurantsByTagAndLocation(
            @PathVariable("rtag") String rtag,
            @PathVariable("rloc") String rloc) {
        
        List<Restaurant> restaurants = restaurantService.findTop10ByTagAndLocation(rtag, rloc);
        return new ResponseEntity<>(restaurants, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(
            @PathVariable(value = "id", required = false) Integer id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        
        System.out.println("상세 정보 API 호출됨: " + id);
        Restaurant restaurant = restaurantService.getRestaurantById(id);
        
        if (restaurant != null) {
            return ResponseEntity.ok(restaurant);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/paged/category/{category}/location/{location}")
    public ResponseEntity<?> getRestaurants(
            @PathVariable("category") String category,
            @PathVariable("location") String location,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        try {
            Page<Restaurant> restaurants = restaurantService.getRestaurantsByCategoryAndLocation(category, location, page, size);
            return ResponseEntity.ok(restaurants);
        } catch (Exception e) {
            // 로그 출력
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred: " + e.getMessage());
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Restaurant>> searchRestaurants(@RequestParam("query") String query) {
        List<Restaurant> results = restaurantService.searchRestaurants(query); // 검색 로직은 service에서 처리
        return ResponseEntity.ok(results);
    }
}
