package com.freelancer.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long projectId;
    private String projectTitle;
    private Long reviewerId;
    private String reviewerUsername;
    private Long revieweeId;
    private String revieweeUsername;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
