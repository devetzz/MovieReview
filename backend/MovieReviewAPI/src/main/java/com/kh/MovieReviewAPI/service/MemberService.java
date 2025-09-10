package com.kh.MovieReviewAPI.service;

import java.util.stream.Collectors;

import com.kh.MovieReviewAPI.entity.Member;
import com.kh.MovieReviewAPI.dto.MemberDTO;
import com.kh.MovieReviewAPI.dto.MemberModifyDTO;

public interface MemberService {
	MemberDTO getKakaoMember(String accessToken);
	
	void modifyMember(MemberModifyDTO memberModifyDTO);

	default MemberDTO entityToDTO(Member member) {
		MemberDTO dto = new MemberDTO(member.getEmail(), member.getPw(), member.getNickname(), member.isSocial(),
				member.getMemberRoleList().stream().map(memberRole -> memberRole.name()).collect(Collectors.toList()));
		return dto;
	}
}
