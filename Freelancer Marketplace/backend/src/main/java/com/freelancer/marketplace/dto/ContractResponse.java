package com.freelancer.marketplace.dto;

import com.freelancer.marketplace.entity.ContractStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContractResponse {
    private Long id;
    private Long projectId;
    private String projectTitle;
    private Long clientId;
    private String clientUsername;
    private Long freelancerId;
    private String freelancerUsername;
    private Double amount;
    private LocalDate startDate;
    private LocalDate endDate;
    private ContractStatus status;
}
