package com.freelancer.marketplace.dto;

import com.freelancer.marketplace.entity.BidStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BidResponse {
    private Long id;
    private Long projectId;
    private String projectTitle;
    private Long freelancerId;
    private String freelancerUsername;
    private Double amount;
    private String proposal;
    private BidStatus status;
    private LocalDateTime createdAt;
}
