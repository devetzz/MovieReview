
package com.kh.MovieReviewAPI.controller;

import com.kh.MovieReviewAPI.dto.TmdbMovieDto;
import com.kh.MovieReviewAPI.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

	private final MovieService movieService;

	@GetMapping("/now-playing")
	public ResponseEntity<List<TmdbMovieDto>> getNowPlayingMovies() {
		List<TmdbMovieDto> movies = movieService.getNowPlayingMovies();
		return ResponseEntity.ok(movies);
	}

	@GetMapping("/{id}")
	public ResponseEntity<TmdbMovieDto> getMovieDetail(@PathVariable("id") Long id) {
		TmdbMovieDto movie = movieService.getMovieDetail(id);
		return ResponseEntity.ok(movie);
	}

	@GetMapping("/upcoming")
	public ResponseEntity<List<TmdbMovieDto>> getUpcomingMovies() {
		List<TmdbMovieDto> movies = movieService.getUpcomingMovies();
		return ResponseEntity.ok(movies);
	}
}
