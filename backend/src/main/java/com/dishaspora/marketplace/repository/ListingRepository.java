package com.dishaspora.marketplace.repository;

import com.dishaspora.common.enums.Enums.ApprovalStatus;
import com.dishaspora.common.enums.Enums.ListingType;
import com.dishaspora.marketplace.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.Instant;
import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long>, JpaSpecificationExecutor<Listing> {

    List<Listing> findByVendorId(Long vendorId);

    List<Listing> findByVendorIdAndStatus(Long vendorId, ApprovalStatus status);

    List<Listing> findByStatus(ApprovalStatus status);

    List<Listing> findByStatusAndTypeAndCountry(ApprovalStatus status, ListingType type, String country);

    long countByVendorIdAndCreatedAtAfter(Long vendorId, Instant after);

    long countByStatus(ApprovalStatus status);
}
