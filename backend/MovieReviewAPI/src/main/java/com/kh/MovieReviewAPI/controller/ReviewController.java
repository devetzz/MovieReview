package com.kh.MovieReviewAPI.controller;

import com.kh.MovieReviewAPI.dto.ReviewRequest;
import com.kh.MovieReviewAPI.dto.ReviewResponse;
import com.kh.MovieReviewAPI.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 리뷰 작성
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @RequestHeader("X-USER-EMAIL") String email,
            @RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.createReview(email, request);
        return ResponseEntity.ok(response);
    }

    // 특정 영화의 모든 리뷰 조회
    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getReviewsByMovie(@RequestParam Long tmdbId) {
        List<ReviewResponse> responses = reviewService.getReviewsByMovie(tmdbId);
        return ResponseEntity.ok(responses);
    }

    // 특정 리뷰 조회
    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable Long reviewId) {
        ReviewResponse response = reviewService.getReviewById(reviewId);
        return ResponseEntity.ok(response);
    }

    // 리뷰 수정
    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long reviewId,
            @RequestHeader("X-USER-EMAIL") String email,
            @RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.updateReview(reviewId, email, request);
        return ResponseEntity.ok(response);
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader("X-USER-EMAIL") String email) {
        reviewService.deleteReview(reviewId, email);
        return ResponseEntity.noContent().build();
    }
}