package com.kh.MovieReviewAPI.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.kh.MovieReviewAPI.dto.NoticeRequest;
import com.kh.MovieReviewAPI.dto.NoticeResponse;

public interface NoticeService {
	// 공지사항 생성 (파일 첨부 포함)
	NoticeResponse createNotice(String email, NoticeRequest request, MultipartFile file);

	// 모든 공지사항 조회 (페이징 처리)
	Page<NoticeResponse> getAllNotices(Pageable pageable);

	// 특정 공지사항 조회
	NoticeResponse getNoticeById(Long id);

	// 공지사항 수정 (파일 첨부 선택적)
	NoticeResponse updateNotice(Long id, String email, NoticeRequest request, MultipartFile file);

	// 공지사항 삭제
	void deleteNotice(Long id, String email);
}
