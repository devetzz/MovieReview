package com.kh.MovieReviewAPI.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kh.MovieReviewAPI.entity.Member;

public interface MemberRepository extends JpaRepository<Member, String> {
	
}
