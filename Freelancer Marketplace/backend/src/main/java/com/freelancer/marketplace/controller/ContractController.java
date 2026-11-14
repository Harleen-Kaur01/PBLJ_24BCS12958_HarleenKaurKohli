package com.freelancer.marketplace.controller;

import com.freelancer.marketplace.dto.ContractRequest;
import com.freelancer.marketplace.dto.ContractResponse;
import com.freelancer.marketplace.service.ContractService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> createContract(@Valid @RequestBody ContractRequest request, Principal principal) {
        try {
            return ResponseEntity.ok(contractService.createContract(request, principal.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ContractResponse>> getMyContracts(Principal principal) {
        return ResponseEntity.ok(contractService.getContractsForUser(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getContractById(@PathVariable Long id, Principal principal) {
        try {
            return ResponseEntity.ok(contractService.getContractById(id, principal.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> completeContract(@PathVariable Long id, Principal principal) {
        try {
            return ResponseEntity.ok(contractService.completeContract(id, principal.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelContract(@PathVariable Long id, Principal principal) {
        try {
            return ResponseEntity.ok(contractService.cancelContract(id, principal.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
