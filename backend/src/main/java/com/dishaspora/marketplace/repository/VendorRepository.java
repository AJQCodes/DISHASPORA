package com.dishaspora.marketplace.repository;

import com.dishaspora.common.enums.Enums.ApprovalStatus;
import com.dishaspora.common.enums.Enums.VendorType;
import com.dishaspora.marketplace.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Optional<Vendor> findByOwnerUserId(Long ownerUserId);

    List<Vendor> findByStatus(ApprovalStatus status);

    List<Vendor> findByStatusAndCountry(ApprovalStatus status, String country);

    List<Vendor> findByStatusAndType(ApprovalStatus status, VendorType type);

    List<Vendor> findByStatusAndCountryAndType(ApprovalStatus status, String country, VendorType type);

    long countByStatus(ApprovalStatus status);
}
