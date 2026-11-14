package com.freelancer.marketplace.repository;

import com.freelancer.marketplace.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    Optional<Contract> findByProjectId(Long projectId);
    List<Contract> findByFreelancerId(Long freelancerId);
    List<Contract> findByClientId(Long clientId);
}
