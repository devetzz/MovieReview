package com.kh.MovieReviewAPI.service;

import com.kh.MovieReviewAPI.dto.TmdbMovieDto;

import java.util.List;

public interface MovieService {
    List<TmdbMovieDto> getNowPlayingMovies();
    TmdbMovieDto getMovieDetail(Long id);
    List<TmdbMovieDto> getUpcomingMovies();
}