package com.freelancer.marketplace.controller;

import com.freelancer.marketplace.dto.BidRequest;
import com.freelancer.marketplace.dto.BidRequest;
import com.freelancer.marketplace.service.BidService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    @PostMapping("/projects/{projectId}/bids")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<?> submitBid(
            @PathVariable Long projectId,
            @Valid @RequestBody BidRequest request,
            Principal principal) {
        try {
            return ResponseEntity.ok(bidService.submitBid(projectId, request, principal.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/projects/{projectId}/bids")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> getBidsForProject(@PathVariable Long projectId, Principal principal) {
        try {
            return ResponseEntity.ok(bidService.getBidsForProject(projectId, principal.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/bids/me")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<?> getMyBids(Principal principal) {
        return ResponseEntity.ok(bidService.getMyBids(principal.getName()));
    }

    @PutMapping("/bids/{bidId}/accept")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> acceptBid(@PathVariable Long bidId, Principal principal) {
        try {
            return ResponseEntity.ok(bidService.acceptBid(bidId, principal.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
