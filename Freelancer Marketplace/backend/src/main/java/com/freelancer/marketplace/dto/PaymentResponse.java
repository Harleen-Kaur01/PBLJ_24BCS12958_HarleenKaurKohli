package com.freelancer.marketplace.dto;

import com.freelancer.marketplace.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {
    private Long id;
    private Long contractId;
    private String projectTitle;
    private Double amount;
    private PaymentStatus status;
    private LocalDateTime paymentDate;
    private String clientUsername;
    private String freelancerUsername;
}
