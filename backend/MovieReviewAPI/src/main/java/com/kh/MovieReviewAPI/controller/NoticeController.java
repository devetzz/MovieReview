package com.kh.MovieReviewAPI.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.MovieReviewAPI.dto.NoticeRequest;
import com.kh.MovieReviewAPI.dto.NoticeResponse;
import com.kh.MovieReviewAPI.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

	private final NoticeService noticeService;
	private final ObjectMapper objectMapper;

	@Value("${com.kh.upload.path}") // application.properties에서 파일 저장 경로를 주입받습니다.
	private String uploadDir;

	// 공지사항 생성
	@PostMapping
	public ResponseEntity<NoticeResponse> createNotice(@RequestHeader("X-USER-EMAIL") String email, // 작성자 이메일 (임시)
			@RequestPart("request") String requestJson, // JSON 데이터
			@RequestPart(value = "file", required = false) MultipartFile file) { // 파일 (선택 사항)
		try {
			NoticeRequest request = objectMapper.readValue(requestJson, NoticeRequest.class); // String을 NoticeRequest로 파싱
			NoticeResponse response = noticeService.createNotice(email, request, file);
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // 파싱 오류 처리
		}
	}

	// 모든 공지사항 조회 (페이징)
	@GetMapping
	public ResponseEntity<Page<NoticeResponse>> getAllNotices(
			@PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
		Page<NoticeResponse> notices = noticeService.getAllNotices(pageable);
		return ResponseEntity.ok(notices);
	}

	// 특정 공지사항 조회
	@GetMapping("/{id}")
	public ResponseEntity<NoticeResponse> getNoticeById(@PathVariable Long id) {
		NoticeResponse notice = noticeService.getNoticeById(id);
		return ResponseEntity.ok(notice);
	}

	// 공지사항 수정
	@PutMapping("/{id}")
	public ResponseEntity<NoticeResponse> updateNotice(@PathVariable Long id,
			@RequestHeader("X-USER-EMAIL") String email, // 작성자 이메일 (임시)
			@RequestPart("request") String requestJson,
			@RequestPart(value = "file", required = false) MultipartFile file) {
		try {
			NoticeRequest request = objectMapper.readValue(requestJson, NoticeRequest.class); // String을 NoticeRequest로 파싱
			NoticeResponse response = noticeService.updateNotice(id, email, request, file);
			return ResponseEntity.ok(response);
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // 파싱 오류 처리
		}
	}

	// 공지사항 삭제
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteNotice(@PathVariable Long id, @RequestHeader("X-USER-EMAIL") String email) { // 작성자
																													// 이메일
																													// (임시)
		noticeService.deleteNotice(id, email);
		return ResponseEntity.noContent().build();
	}

	// 파일 다운로드
	@GetMapping("/download/{fileName}")
	public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
		try {
			Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
			Resource resource = new UrlResource(filePath.toUri());

			if (resource.exists() && resource.isReadable()) {
				String contentType = Files.probeContentType(filePath);
				if (contentType == null) {
					contentType = "application/octet-stream";
				}
				return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
						.header(HttpHeaders.CONTENT_DISPOSITION,
								"attachment; filename=\"" + resource.getFilename() + "\"")
						.body(resource);
			} else {
				throw new RuntimeException("파일을 찾을 수 없거나 읽을 수 없습니다: " + fileName);
			}
		} catch (MalformedURLException e) {
			throw new RuntimeException("파일 다운로드 URL 오류: " + e.getMessage());
		} catch (IOException e) {
			throw new RuntimeException("파일 타입 결정 오류: " + e.getMessage());
		}
	}
}