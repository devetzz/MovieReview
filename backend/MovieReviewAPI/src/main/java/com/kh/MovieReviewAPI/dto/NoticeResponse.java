package com.kh.MovieReviewAPI.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoticeResponse {
	private Long id;
	private String title;
	private String content;
	private String authorNickname;
	private LocalDateTime createdAt;
	private String filePath;
}
