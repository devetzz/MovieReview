package com.kh.MovieReviewAPI.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "REVIEW")
@SequenceGenerator(
    name = "REVIEW_SEQ_GENERATOR",
    sequenceName = "REVIEW_SEQ",
    allocationSize = 1
)
public class Review {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "REVIEW_SEQ_GENERATOR")
    private Long id;

    @ManyToOne
    private Member member;

    @ManyToOne
    private Movie movie;

    private String content;
    private int rating; // 1~5
}
