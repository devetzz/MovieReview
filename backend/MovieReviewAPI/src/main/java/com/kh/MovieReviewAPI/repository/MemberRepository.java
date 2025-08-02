package com.kh.MovieReviewAPI.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kh.MovieReviewAPI.entity.Member;

public interface MemberRepository extends JpaRepository<Member, String> {

	
	@EntityGraph(attributePaths = { "memberRoleList" })
	@Query("select m from Member m where m.email = :email")
	Member getWithRoles(@Param("email") String email);
	
    Optional<Member> findByEmail(String email);
	
}
