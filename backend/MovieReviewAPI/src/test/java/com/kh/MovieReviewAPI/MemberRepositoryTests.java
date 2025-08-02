package com.kh.MovieReviewAPI;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.kh.MovieReviewAPI.entity.Member;
import com.kh.MovieReviewAPI.entity.MemberRole;
import com.kh.MovieReviewAPI.repository.MemberRepository;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class MemberRepositoryTests {
	@Autowired
	private MemberRepository memberRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;

//	@Test
	public void testInsertMember() {
		for (int i = 0; i < 10; i++) {
			// user1~5 : 권한 USER
			Member member = Member.builder().email("user" + i + "@kh.com").pw(passwordEncoder.encode("Pa$$w0rd"))
					.nickname("USER" + i).build();
			member.addRole(MemberRole.USER);
			// user6~9 : 권한 USER, MANAGER
			if (i >= 6 && i <= 9) {
				member.addRole(MemberRole.MANAGER);
			}
			// user0 : 권한 USER, MANAGER, ADMIN
			if (i <= 0) {
				member.addRole(MemberRole.ADMIN);
				member.addRole(MemberRole.MANAGER);
			}
			memberRepository.save(member);
		}
	}

	@Test
	public void testRead() {
		String email = "user6@kh.com";
		Member member = memberRepository.getWithRoles(email);
		log.info("------------------");
		log.info(member + " , " + member.getMemberRoleList().toString());
	}
}
