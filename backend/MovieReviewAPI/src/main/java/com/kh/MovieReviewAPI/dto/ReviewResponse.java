package com.kh.MovieReviewAPI.dto;

import java.time.LocalDateTime;

public class ReviewResponse {
	private Long id;
	private String content;
	private int rating;
	private String memberUserName;
	private LocalDateTime createdAt;
}
