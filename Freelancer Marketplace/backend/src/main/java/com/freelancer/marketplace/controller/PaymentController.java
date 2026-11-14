package com.freelancer.marketplace.controller;

import com.freelancer.marketplace.dto.PaymentRequest;
import com.freelancer.marketplace.dto.PaymentResponse;
import com.freelancer.marketplace.entity.PaymentStatus;
import com.freelancer.marketplace.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> createPayment(@Valid @RequestBody PaymentRequest request, Principal principal) {
        try {
            return ResponseEntity.ok(paymentService.createPayment(request, principal.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{paymentId}/status")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Long paymentId, 
            @RequestParam PaymentStatus status, 
            Principal principal) {
        try {
            return ResponseEntity.ok(paymentService.updatePaymentStatus(paymentId, status, principal.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<PaymentResponse>> getPaymentHistory(Principal principal) {
        return ResponseEntity.ok(paymentService.getPaymentHistory(principal.getName()));
    }
}
