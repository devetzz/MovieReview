package com.kh.MovieReviewAPI.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.MovieReviewAPI.dto.ReviewRequest;
import com.kh.MovieReviewAPI.dto.ReviewResponse;
import com.kh.MovieReviewAPI.dto.TmdbMovieDto;
import com.kh.MovieReviewAPI.entity.Member;
import com.kh.MovieReviewAPI.entity.Movie;
import com.kh.MovieReviewAPI.entity.Review;
import com.kh.MovieReviewAPI.repository.MemberRepository;
import com.kh.MovieReviewAPI.repository.MovieRepository;
import com.kh.MovieReviewAPI.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

	private final ReviewRepository reviewRepository;
	private final MemberRepository memberRepository;
	private final MovieRepository movieRepository;
	private final MovieService movieService;

	@Override
	@Transactional
	public ReviewResponse createReview(String email, ReviewRequest request) {
		Member member = memberRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));

		Movie movie = movieRepository.findById(request.getTmdbId())
				.orElseGet(() -> {
					// TMDB API를 통해 영화 정보를 가져와서 설정합니다.
				    TmdbMovieDto tmdbMovieDto = movieService.getMovieDetail(request.getTmdbId());
					Movie newMovie = new Movie();
					newMovie.setTmdbId(request.getTmdbId());
					newMovie.setTitle(tmdbMovieDto.getTitle());// 제목 설정
					newMovie.setPosterUrl(tmdbMovieDto.getPosterPath());// 포스터 URL 설정
					newMovie.setOverview(tmdbMovieDto.getOverview());// 개요 설정
							
					return movieRepository.save(newMovie);
				});

		Review review = new Review();
		review.setContent(request.getContent());
		review.setRating(request.getRating());
		review.setMember(member);
		review.setMovie(movie);
		review.setCreatedAt(LocalDateTime.now());

		Review saved = reviewRepository.save(review);

		return new ReviewResponse(
				saved.getId(),
				saved.getContent(),
				saved.getRating(),
				saved.getMember().getNickname(),
				saved.getMember().getEmail(),
				saved.getCreatedAt()
		);
	}

	@Override
	@Transactional(readOnly = true)
	public List<ReviewResponse> getReviewsByMovie(Long tmdbId) {
		List<Review> reviews = reviewRepository.findByMovie_TmdbId(tmdbId);
		return reviews.stream()
				.map(review -> new ReviewResponse(
						review.getId(),
						review.getContent(),
						review.getRating(),
						review.getMember().getNickname(),
						review.getMember().getEmail(),
						review.getCreatedAt()))
				.collect(Collectors.toList());
	}

	@Override
	@Transactional
	public ReviewResponse updateReview(Long reviewId, String email, ReviewRequest request) {
		Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("리뷰가 존재하지 않습니다."));

		if (!review.getMember().getEmail().equals(email)) {
			throw new RuntimeException("리뷰를 수정할 권한이 없습니다.");
		}

		review.setContent(request.getContent());
		review.setRating(request.getRating());

		Review updated = reviewRepository.save(review);

		return new ReviewResponse(updated.getId(), updated.getContent(), updated.getRating(),
				updated.getMember().getNickname(), updated.getMember().getEmail(), updated.getCreatedAt());
	}

	@Override
	@Transactional
	public void deleteReview(Long reviewId, String email) {
		Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("리뷰가 존재하지 않습니다."));

		if (!review.getMember().getEmail().equals(email)) {
			throw new RuntimeException("리뷰를 삭제할 권한이 없습니다.");
		}

		reviewRepository.delete(review);
	}

	@Override
	@Transactional(readOnly = true)
	public ReviewResponse getReviewById(Long reviewId) {
		Review review = reviewRepository.findById(reviewId)
				.orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));

		return new ReviewResponse(
				review.getId(),
				review.getContent(),
				review.getRating(),
				review.getMember().getNickname(),
				review.getMember().getEmail(),
				review.getCreatedAt()
		);
	}
}