package com.kh.MovieReviewAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
	private Long tmdbId;
	private String content;
	private int rating;
}
