package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.ResourceNotFoundException;
import com.example.demo.dto.ReviewDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.*;

import com.example.demo.entity.Review;

@Service
public class ReviewService {

	 @Autowired
	    private ReviewRepository reviewRepository;
	    
	    @Autowired
	    private UserRepository userRepository;

	    public Review saveReview(Review review, String username) {
	        User user = userRepository.findByUsername(username)
	            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
	        review.setUser(user);
	        return reviewRepository.save(review);
	    }

	    public List<ReviewDTO> getReviewsByRestaurantId(Integer rid) {
	        List<Object[]> results = reviewRepository.findByRestaurantRidWithUsername(rid);
	        return results.stream()
	            .map(result -> {
	                Review review = (Review) result[0];
	                String username = (String) result[1];
	                return new ReviewDTO(review, username);
	            })
	            .collect(Collectors.toList());
	    }
    public Review updateReview(Integer reviewid, Review review) {
        Review existingReview = reviewRepository.findById(reviewid)
            .orElseThrow(() -> 
            new ResourceNotFoundException("Review not found"));
        
        existingReview.setReviewstar(review.getReviewstar());
        existingReview.setContent(review.getContent());
        
        return reviewRepository.save(existingReview);
    }

    public void deleteReview(Integer reviewid) {
        reviewRepository.deleteById(reviewid);
    }
}