package com.kh.MovieReviewAPI.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kh.MovieReviewAPI.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
	// 영화별 리뷰 조회
	List<Review> findByMovie_TmdbId(Long tmdbId);

	// 회원이 작성한 리뷰 목록
	List<Review> findByMember_Email(String email);

	// 영화별 평균 평점 계산 (선택적으로 쿼리 작성 가능)
	@Query("SELECT AVG(r.rating) FROM Review r WHERE r.movie.tmdbId = :tmdbId")
	Double findAverageRatingByMovie(@Param("tmdbId") Long tmdbId);
}
