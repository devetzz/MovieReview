package com.kh.MovieReviewAPI.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
	private Long id;
	private String content;
	private int rating;
	private String memberUserName;
	private String memberEmail;
	private LocalDateTime createdAt;
}
