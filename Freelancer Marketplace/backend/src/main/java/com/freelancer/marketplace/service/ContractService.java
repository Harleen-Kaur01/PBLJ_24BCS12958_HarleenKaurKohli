package com.freelancer.marketplace.service;

import com.freelancer.marketplace.dto.ContractRequest;
import com.freelancer.marketplace.dto.ContractResponse;
import com.freelancer.marketplace.entity.*;
import com.freelancer.marketplace.repository.ContractRepository;
import com.freelancer.marketplace.repository.ProjectRepository;
import com.freelancer.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Transactional
    public ContractResponse createContract(ContractRequest request, String username) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        if (!project.getClient().getUsername().equals(username)) {
            throw new IllegalArgumentException("Only the project client can create a contract");
        }

        if (project.getContract() != null) {
            throw new IllegalArgumentException("A contract already exists for this project");
        }

        User freelancer = userRepository.findById(request.getFreelancerId())
                .orElseThrow(() -> new IllegalArgumentException("Freelancer not found"));

        Contract contract = Contract.builder()
                .project(project)
                .client(project.getClient())
                .freelancer(freelancer)
                .amount(request.getAmount())
                .startDate(LocalDate.now())
                .status(ContractStatus.ACTIVE)
                .build();

        project.setStatus(ProjectStatus.IN_PROGRESS);
        projectRepository.save(project);

        Contract savedContract = contractRepository.save(contract);
        return mapToResponse(savedContract);
    }

    @Transactional(readOnly = true)
    public ContractResponse getContractById(Long id, String username) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found"));

        if (!contract.getClient().getUsername().equals(username) && !contract.getFreelancer().getUsername().equals(username)) {
            throw new IllegalArgumentException("You are not authorized to view this contract");
        }

        return mapToResponse(contract);
    }

    @Transactional(readOnly = true)
    public List<ContractResponse> getContractsForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Contract> contracts = new ArrayList<>();
        if (user.getRole() == Role.CLIENT) {
            contracts = contractRepository.findByClientId(user.getId());
        } else if (user.getRole() == Role.FREELANCER) {
            contracts = contractRepository.findByFreelancerId(user.getId());
        }

        return contracts.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public ContractResponse completeContract(Long id, String username) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found"));

        if (!contract.getClient().getUsername().equals(username)) {
            throw new IllegalArgumentException("Only the client can complete the contract");
        }

        if (contract.getStatus() != ContractStatus.ACTIVE) {
            throw new IllegalArgumentException("Only active contracts can be completed");
        }

        contract.setStatus(ContractStatus.COMPLETED);
        contract.setEndDate(LocalDate.now());

        Project project = contract.getProject();
        project.setStatus(ProjectStatus.COMPLETED);
        projectRepository.save(project);

        return mapToResponse(contractRepository.save(contract));
    }

    @Transactional
    public ContractResponse cancelContract(Long id, String username) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found"));

        if (!contract.getClient().getUsername().equals(username) && !contract.getFreelancer().getUsername().equals(username)) {
            throw new IllegalArgumentException("You are not authorized to cancel this contract");
        }

        if (contract.getStatus() != ContractStatus.ACTIVE) {
            throw new IllegalArgumentException("Only active contracts can be cancelled/terminated");
        }

        contract.setStatus(ContractStatus.TERMINATED);
        contract.setEndDate(LocalDate.now());

        Project project = contract.getProject();
        project.setStatus(ProjectStatus.CANCELLED);
        projectRepository.save(project);

        return mapToResponse(contractRepository.save(contract));
    }

    private ContractResponse mapToResponse(Contract contract) {
        return ContractResponse.builder()
                .id(contract.getId())
                .projectId(contract.getProject().getId())
                .projectTitle(contract.getProject().getTitle())
                .clientId(contract.getClient().getId())
                .clientUsername(contract.getClient().getUsername())
                .freelancerId(contract.getFreelancer().getId())
                .freelancerUsername(contract.getFreelancer().getUsername())
                .amount(contract.getAmount())
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .status(contract.getStatus())
                .build();
    }
}
