package com.kh.MovieReviewAPI.service;

import java.util.List;

import com.kh.MovieReviewAPI.dto.ReviewRequest;
import com.kh.MovieReviewAPI.dto.ReviewResponse;

public interface ReviewService {
	ReviewResponse createReview(String email, ReviewRequest request);
	
	List<ReviewResponse> getReviewsByMovie(Long tmdbId);

	ReviewResponse updateReview(Long reviewId, String email, ReviewRequest request);

    void deleteReview(Long reviewId, String email);
    
    ReviewResponse getReviewById(Long reviewId);
}
