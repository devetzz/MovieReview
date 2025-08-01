
package com.kh.MovieReviewAPI.service;

import com.kh.MovieReviewAPI.dto.TmdbMovieDto;
import com.kh.MovieReviewAPI.dto.TmdbResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {

	private final RestTemplate restTemplate;

	@Value("${tmdb.api.key}")
	private String apiKey;

	@Value("${tmdb.api.base-url}")
	private String baseUrl;

	@Override
	public List<TmdbMovieDto> getNowPlayingMovies() {
		String url = baseUrl + "/movie/now_playing?api_key=" + apiKey + "&language=ko-KR&page=1";
		TmdbResponseDto response = restTemplate.getForObject(url, TmdbResponseDto.class);

		if (response != null && response.getResults() != null) {
			return response.getResults();
		} else {
			return Collections.emptyList(); // API 응답이 없거나 결과가 null일 경우 빈 리스트 반환
		}
	}

	@Override
	public TmdbMovieDto getMovieDetail(Long id) {
		String url = baseUrl + "/movie/" + id + "?api_key=" + apiKey + "&language=ko-KR";
		return restTemplate.getForObject(url, TmdbMovieDto.class);
	}

	@Override
	public List<TmdbMovieDto> getUpcomingMovies() {
		String url = baseUrl + "/movie/upcoming?api_key=" + apiKey + "&language=ko-KR&page=1";
		TmdbResponseDto response = restTemplate.getForObject(url, TmdbResponseDto.class);

		if (response != null && response.getResults() != null) {
			return response.getResults();
		} else {
			return Collections.emptyList();
		}
	}
}
