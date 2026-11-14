package com.freelancer.marketplace.service;

import com.freelancer.marketplace.dto.ReviewRequest;
import com.freelancer.marketplace.dto.ReviewResponse;
import com.freelancer.marketplace.entity.Project;
import com.freelancer.marketplace.entity.Review;
import com.freelancer.marketplace.entity.User;
import com.freelancer.marketplace.repository.ProjectRepository;
import com.freelancer.marketplace.repository.ReviewRepository;
import com.freelancer.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse createReview(ReviewRequest request, String username) {
        User reviewer = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Reviewer not found"));

        User reviewee = userRepository.findById(request.getRevieweeId())
                .orElseThrow(() -> new IllegalArgumentException("Reviewee not found"));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        // Basic check: Enforce that reviewer was involved in the project (either the client or the freelancer)
        boolean isClient = project.getClient().getId().equals(reviewer.getId());
        User projectFreelancer = (project.getContract() != null) ? project.getContract().getFreelancer() : null;
        
        // Enforce that reviewer must be either the client or the assigned freelancer
        if (!isClient && (projectFreelancer == null || !projectFreelancer.getId().equals(reviewer.getId()))) {
             throw new IllegalArgumentException("You are not authorized to leave a review for this project");
        }

        Review review = Review.builder()
                .project(project)
                .reviewer(reviewer)
                .reviewee(reviewee)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);
        return mapToResponse(savedReview);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsForUser(Long userId) {
        return reviewRepository.findByRevieweeId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getMyReviews(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return getReviewsForUser(user.getId());
    }

    @Transactional(readOnly = true)
    public Double getAverageRating(Long userId) {
        List<Review> reviews = reviewRepository.findByRevieweeId(userId);
        if (reviews.isEmpty()) return 0.0;
        
        double sum = reviews.stream().mapToInt(Review::getRating).sum();
        return sum / reviews.size();
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .projectId(review.getProject().getId())
                .projectTitle(review.getProject().getTitle())
                .reviewerId(review.getReviewer().getId())
                .reviewerUsername(review.getReviewer().getUsername())
                .revieweeId(review.getReviewee().getId())
                .revieweeUsername(review.getReviewee().getUsername())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
