package com.kh.MovieReviewAPI.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Movie {
	@Id
	private Long tmdbId;	// TMDB 에서 가져온 ID
	private String title;
	private String posterUrl;
	private String overview;
}
