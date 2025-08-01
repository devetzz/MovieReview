package com.kh.MovieReviewAPI.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.kh.MovieReviewAPI.dto.NoticeRequest;
import com.kh.MovieReviewAPI.dto.NoticeResponse;
import com.kh.MovieReviewAPI.entity.Member;
import com.kh.MovieReviewAPI.entity.Notice;
import com.kh.MovieReviewAPI.repository.MemberRepository;
import com.kh.MovieReviewAPI.repository.NoticeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {

	private final NoticeRepository noticeRepository;
	private final MemberRepository memberRepository;

	@Value("${com.kh.upload.path}")
	private String uploadDir;

	@Override
	@Transactional
	public NoticeResponse createNotice(String email, NoticeRequest request, MultipartFile file) {
		Member author = memberRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("작성자(회원)를 찾을 수 없습니다."));

		Notice notice = new Notice();
		notice.setTitle(request.getTitle());
		notice.setContent(request.getContent());
		notice.setAuthor(author);

		if (file != null && !file.isEmpty()) {
			try {
				String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
				Path copyOfLocation = Paths.get(uploadDir + fileName);
				Files.copy(file.getInputStream(), copyOfLocation);
				notice.setFilePath(fileName); // DB에는 파일 이름만 저장
			} catch (IOException e) {
				throw new RuntimeException("파일 업로드 실패: " + e.getMessage());
			}
		}
		
		Notice savedNotice = noticeRepository.save(notice);
	    return convertToDto(savedNotice);
	}


	@Override
	@Transactional(readOnly = true)
	public Page<NoticeResponse> getAllNotices(Pageable pageable) {
		return noticeRepository.findAll(pageable).map(this::convertToDto);
	}

	@Override
	@Transactional(readOnly = true)
	public NoticeResponse getNoticeById(Long id) {
		Notice notice = noticeRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("공지사항을 찾을 수 없습니다."));
		return convertToDto(notice);
	}

	@Override
	@Transactional
	public NoticeResponse updateNotice(Long id, String email, NoticeRequest request, MultipartFile file) {
		Notice notice = noticeRepository.findById(id).orElseThrow(() -> new RuntimeException("공지사항을 찾을 수 없습니다."));

		if (!notice.getAuthor().getEmail().equals(email)) {
			throw new RuntimeException("공지사항을 수정할 권한이 없습니다.");
		}

		notice.setTitle(request.getTitle());
		notice.setContent(request.getContent());

		if (file != null && !file.isEmpty()) {
			// 기존 파일 삭제 (선택 사항)
			if (notice.getFilePath() != null) {
				try {
					Files.deleteIfExists(Paths.get(uploadDir + notice.getFilePath()));
				} catch (IOException e) {
					// 파일 삭제 실패는 경고만 하고 진행
					System.err.println("기존 파일 삭제 실패: " + e.getMessage());
				}
			}
			try {
				String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
				Path copyOfLocation = Paths.get(uploadDir + fileName);
				Files.copy(file.getInputStream(), copyOfLocation);
				notice.setFilePath(fileName);
			} catch (IOException e) {
				throw new RuntimeException("파일 업로드 실패: " + e.getMessage());
			}
		} else if (request.getFilePath() == null && notice.getFilePath() != null) {
			// 파일이 제거되었을 경우 (프론트에서 파일 제거 요청 시)
			try {
				Files.deleteIfExists(Paths.get(uploadDir + notice.getFilePath()));
				notice.setFilePath(null);
			} catch (IOException e) {
				System.err.println("파일 제거 실패: " + e.getMessage());
			}
		}

		Notice updatedNotice = noticeRepository.save(notice);
		return convertToDto(updatedNotice);
	}

	@Override
	@Transactional
	public void deleteNotice(Long id, String email) {
		Notice notice = noticeRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("공지사항을 찾을 수 없습니다."));
		   
        if (!notice.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("공지사항을 삭제할 권한이 없습니다.");
        }
		   
		// 파일이 있다면 파일도 삭제
		if (notice.getFilePath() != null) {
		    try {
		        Files.deleteIfExists(Paths.get(uploadDir + notice.getFilePath()));
		    } catch (IOException e) {
		        System.err.println("파일 삭제 실패: " + e.getMessage());
		    }
		}
		noticeRepository.delete(notice);
	}
	

	private NoticeResponse convertToDto(Notice notice) {
		return new NoticeResponse(
			notice.getId(),
			notice.getTitle(),
			notice.getContent(),
			notice.getAuthor().getNickname(),
			notice.getCreatedAt(),
			notice.getFilePath()
		);
	}

}
