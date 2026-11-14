package com.freelancer.marketplace.service;

import com.freelancer.marketplace.dto.BidRequest;
import com.freelancer.marketplace.dto.BidResponse;
import com.freelancer.marketplace.entity.*;
import com.freelancer.marketplace.repository.BidRepository;
import com.freelancer.marketplace.repository.ContractRepository;
import com.freelancer.marketplace.repository.ProjectRepository;
import com.freelancer.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository bidRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ContractRepository contractRepository;

    @Transactional
    public BidResponse submitBid(Long projectId, BidRequest request, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        if (project.getStatus() != ProjectStatus.OPEN) {
            throw new IllegalArgumentException("Cannot bid on a project that is not OPEN");
        }

        User freelancer = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if freelancer already submitted a bid for this project
        boolean alreadyBid = project.getBids().stream()
                .anyMatch(b -> b.getFreelancer().getId().equals(freelancer.getId()));
        if (alreadyBid) {
            throw new IllegalArgumentException("You have already submitted a bid for this project");
        }

        Bid bid = Bid.builder()
                .project(project)
                .freelancer(freelancer)
                .amount(request.getAmount())
                .proposal(request.getProposal())
                .status(BidStatus.PENDING)
                .build();

        Bid savedBid = bidRepository.save(bid);
        return mapToResponse(savedBid);
    }

    @Transactional(readOnly = true)
    public List<BidResponse> getBidsForProject(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        if (!project.getClient().getUsername().equals(username)) {
            throw new IllegalArgumentException("Only the project client can view bids");
        }

        return bidRepository.findByProjectId(projectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BidResponse> getMyBids(String username) {
        User freelancer = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return bidRepository.findByFreelancerId(freelancer.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BidResponse acceptBid(Long bidId, String username) {
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new IllegalArgumentException("Bid not found"));

        Project project = bid.getProject();

        if (!project.getClient().getUsername().equals(username)) {
            throw new IllegalArgumentException("Only the project client can accept a bid");
        }

        if (project.getStatus() != ProjectStatus.OPEN) {
            throw new IllegalArgumentException("Project is no longer open for bids");
        }

        // Accept this bid
        bid.setStatus(BidStatus.ACCEPTED);
        bidRepository.save(bid);

        // Reject all other pending bids for this project
        List<Bid> otherBids = bidRepository.findByProjectId(project.getId()).stream()
                .filter(b -> !b.getId().equals(bidId) && b.getStatus() == BidStatus.PENDING)
                .collect(Collectors.toList());
        
        for (Bid otherBid : otherBids) {
            otherBid.setStatus(BidStatus.REJECTED);
        }
        bidRepository.saveAll(otherBids);

        // Update Project Status
        project.setStatus(ProjectStatus.IN_PROGRESS);
        projectRepository.save(project);

        // Automatically create Contract
        Contract contract = Contract.builder()
                .project(project)
                .client(project.getClient())
                .freelancer(bid.getFreelancer())
                .amount(bid.getAmount())
                .startDate(LocalDate.now())
                .status(ContractStatus.ACTIVE)
                .build();
        contractRepository.save(contract);

        return mapToResponse(bid);
    }

    private BidResponse mapToResponse(Bid bid) {
        return BidResponse.builder()
                .id(bid.getId())
                .projectId(bid.getProject().getId())
                .projectTitle(bid.getProject().getTitle())
                .freelancerId(bid.getFreelancer().getId())
                .freelancerUsername(bid.getFreelancer().getUsername())
                .amount(bid.getAmount())
                .proposal(bid.getProposal())
                .status(bid.getStatus())
                .createdAt(bid.getCreatedAt())
                .build();
    }
}
