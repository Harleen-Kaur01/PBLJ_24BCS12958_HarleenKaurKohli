package com.freelancer.marketplace.service;

import com.freelancer.marketplace.dto.PaymentRequest;
import com.freelancer.marketplace.dto.PaymentResponse;
import com.freelancer.marketplace.entity.*;
import com.freelancer.marketplace.repository.ContractRepository;
import com.freelancer.marketplace.repository.PaymentRepository;
import com.freelancer.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;

    @Transactional
    public PaymentResponse createPayment(PaymentRequest request, String username) {
        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new IllegalArgumentException("Contract not found"));

        if (!contract.getClient().getUsername().equals(username)) {
            throw new IllegalArgumentException("Only the client can initiate a payment for this contract");
        }

        Payment payment = Payment.builder()
                .contract(contract)
                .amount(request.getAmount())
                .status(PaymentStatus.PENDING)
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        return mapToResponse(savedPayment);
    }

    @Transactional
    public PaymentResponse updatePaymentStatus(Long paymentId, PaymentStatus status, String username) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        // In a real world app, this would be restricted to Admins or webhooks from Stripe/PayPal
        // For simulation, we allow the client to update the status to processing/paid.
        if (!payment.getContract().getClient().getUsername().equals(username)) {
            throw new IllegalArgumentException("Unauthorized to update this payment status");
        }

        payment.setStatus(status);
        return mapToResponse(paymentRepository.save(payment));
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Contract> userContracts = new ArrayList<>();
        if (user.getRole() == Role.CLIENT) {
            userContracts = contractRepository.findByClientId(user.getId());
        } else if (user.getRole() == Role.FREELANCER) {
            userContracts = contractRepository.findByFreelancerId(user.getId());
        }

        List<PaymentResponse> paymentHistory = new ArrayList<>();
        
        for (Contract contract : userContracts) {
            List<Payment> payments = paymentRepository.findByContractId(contract.getId());
            payments.forEach(p -> paymentHistory.add(mapToResponse(p)));
        }

        // Sort by most recent first
        paymentHistory.sort(Comparator.comparing(PaymentResponse::getPaymentDate).reversed());
        return paymentHistory;
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .contractId(payment.getContract().getId())
                .projectTitle(payment.getContract().getProject().getTitle())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .paymentDate(payment.getPaymentDate())
                .clientUsername(payment.getContract().getClient().getUsername())
                .freelancerUsername(payment.getContract().getFreelancer().getUsername())
                .build();
    }
}
