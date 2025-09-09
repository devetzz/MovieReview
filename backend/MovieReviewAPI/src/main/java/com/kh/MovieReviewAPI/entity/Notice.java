package com.kh.MovieReviewAPI.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "NOTICE")
@SequenceGenerator( // 이 부분 추가
		name = "NOTICE_SEQ_GENERATOR", // 시퀀스 제너레이터 이름
		sequenceName = "NOTICE_SEQ", // 데이터베이스 시퀀스 이름
		allocationSize = 1 // 시퀀스 할당 크기
)
@Getter
@Setter
@ToString(exclude = "author")
@NoArgsConstructor
public class Notice {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "NOTICE_SEQ_GENERATOR")
	private Long id;

	@Column(nullable = false)
	private String title;

	@Lob
	@Column(nullable = false)
	private String content;

	@ManyToOne(fetch = FetchType.LAZY) // 지연 로딩
	@JoinColumn(name = "member_id", nullable = false) // Member 테이블의 ID와 조인
	private Member author; // 작성자

	@CreationTimestamp // 엔터티가 생성될 때 자동으로 현재 시간 저장
	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "file_path") // 파일 경로 (nullable: 파일 첨부가 필수는 아님)
	private String filePath;
}
