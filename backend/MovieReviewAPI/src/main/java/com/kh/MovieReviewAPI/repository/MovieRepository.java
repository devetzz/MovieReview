package com.kh.MovieReviewAPI.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kh.MovieReviewAPI.entity.Movie;

public interface MovieRepository extends JpaRepository<Movie, Long> {

}
