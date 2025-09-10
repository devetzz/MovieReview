package com.kh.MovieReviewAPI.service;

import java.util.LinkedHashMap;
import java.util.Optional;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.kh.MovieReviewAPI.entity.Member;
import com.kh.MovieReviewAPI.entity.MemberRole;
import com.kh.MovieReviewAPI.dto.MemberDTO;
import com.kh.MovieReviewAPI.dto.MemberModifyDTO;
import com.kh.MovieReviewAPI.repository.MemberRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class MemberServiceImpl implements MemberService {
	private final MemberRepository memberRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public MemberDTO getKakaoMember(String accessToken) {
		String email = getEmailFromKakaoAccessToken(accessToken);
		log.info("email: " + email);
		// 카카오 인증 => 내 멤버테이블에 존재하는 사람인지 아닌지 체크
		Optional<Member> result = memberRepository.findById(email);
		// 기존의 회원
		if (result.isPresent()) {
			MemberDTO memberDTO = entityToDTO(result.get());
			return memberDTO;
		}
		// 회원이 아니었다면 닉네임은 '소셜회원'으로 패스워드는 임의로 생성된 Member가 만들어진다.
		Member socialMember = makeSocialMember(email);
		memberRepository.save(socialMember);
		MemberDTO memberDTO = entityToDTO(socialMember);

		return memberDTO;
	}

	private Member makeSocialMember(String email) {
		// 임의 비밀번호 생성
		String tempPassword = makeTempPassword();
		log.info("tempPassword: " + tempPassword);
		String nickname = "소셜회원";
		// 인증과 인가 등록된 Member
		Member member = Member.builder().email(email).pw(passwordEncoder.encode(tempPassword)).nickname(nickname)
				.social(true).build();
		member.addRole(MemberRole.USER);
		return member;
	}

	// 임의 비밀번호 생성 (10자리)
	private String makeTempPassword() {
		StringBuffer buffer = new StringBuffer();
		for (int i = 0; i < 10; i++) {
			buffer.append((char) ((int) (Math.random() * 55) + 65));
		}
		return buffer.toString();
	}

	private String getEmailFromKakaoAccessToken(String accessToken) {
		// 사용자정보를 가져오는 url
		String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";
		if (accessToken == null) {
			throw new RuntimeException("Access Token is null");
		}
		// RestTemplate 클래스는 자바코드로 외부 REST API 호출할 때 사용한다.
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Bearer " + accessToken);
		headers.add("Content-Type", "application/x-www-form-urlencoded");
		HttpEntity<String> entity = new HttpEntity<>(headers);

		// 카카오 API 요청에 사용할 URL을 생성한다. Request 요청 https://kapi.kakao.com/v2/user/me"
		UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(kakaoGetUserURL).build();
		ResponseEntity<LinkedHashMap> response = restTemplate.exchange(uriBuilder.toString(), // 요청 URL
				HttpMethod.GET, // HTTP 메서드 (GET)
				entity, // 요청 헤더가 포함된 HttpEntity (예: Authorization)
				LinkedHashMap.class // 응답 본문을 매핑할 클래스
		);
		log.info(response);
		LinkedHashMap<String, LinkedHashMap> bodyMap = response.getBody();
		log.info(bodyMap);
		LinkedHashMap<String, String> kakaoAccount = bodyMap.get("kakao_account");
		log.info("kakaoAccount: " + kakaoAccount);
		return kakaoAccount.get("email");
	}

	@Override
	public void modifyMember(MemberModifyDTO memberModifyDTO) {
		Optional<Member> result = memberRepository.findById(memberModifyDTO.getEmail());
		Member member = result.orElseThrow();
		member.changePw(passwordEncoder.encode(memberModifyDTO.getPw()));
		member.changeSocial(false);
		member.changeNickname(memberModifyDTO.getNickname());
		memberRepository.save(member);
	}

}
