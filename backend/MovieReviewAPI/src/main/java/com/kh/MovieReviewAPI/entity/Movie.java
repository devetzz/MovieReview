package com.kh.MovieReviewAPI.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Movie {
	@Id
	private Long tmdbId;	// TMDB 에서 가져온 ID
	private String title;
	private String posterUrl;
	@Column(length = 2000)
	private String overview;
}
