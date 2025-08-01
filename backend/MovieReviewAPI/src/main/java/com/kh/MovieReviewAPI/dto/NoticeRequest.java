package com.kh.MovieReviewAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoticeRequest {
	private String title;
	private String content;
	private String filePath;
	// 파일은 MultipartFile로 컨트롤러에서 직접 받으므로 DTO에는 포함하지 않습니다.
	// 작성자 정보는 헤더나 인증 컨텍스트에서 가져올 예정입니다.
}
