package com.freelancer.marketplace.dto;

import com.freelancer.marketplace.entity.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private Double budget;
    private ProjectStatus status;
    private Long clientId;
    private String clientName;
    private LocalDateTime createdAt;
}
