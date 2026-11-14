package com.freelancer.marketplace.controller;

import com.freelancer.marketplace.dto.ReviewRequest;
import com.freelancer.marketplace.dto.ReviewResponse;
import com.freelancer.marketplace.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<?> createReview(@Valid @RequestBody ReviewRequest request, Principal principal) {
        try {
            return ResponseEntity.ok(reviewService.createReview(request, principal.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsForUser(userId));
    }

    @GetMapping("/me")
    public ResponseEntity<List<ReviewResponse>> getMyReviews(Principal principal) {
        return ResponseEntity.ok(reviewService.getMyReviews(principal.getName()));
    }

    @GetMapping("/user/{userId}/average")
    public ResponseEntity<?> getAverageRating(@PathVariable Long userId) {
        Double average = reviewService.getAverageRating(userId);
        return ResponseEntity.ok(Map.of("averageRating", average));
    }
}
