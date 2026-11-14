package com.freelancer.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "freelancer_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FreelancerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String skills;

    private String portfolioUrl;

    private Double hourlyRate;

    @Column(columnDefinition = "TEXT")
    private String bio;
}
