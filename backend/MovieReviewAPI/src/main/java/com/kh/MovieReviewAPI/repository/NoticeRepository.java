package com.kh.MovieReviewAPI.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kh.MovieReviewAPI.entity.Notice;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

}
