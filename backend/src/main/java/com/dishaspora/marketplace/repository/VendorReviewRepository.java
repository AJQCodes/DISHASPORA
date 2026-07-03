package com.dishaspora.marketplace.repository;

import com.dishaspora.marketplace.entity.VendorReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VendorReviewRepository extends JpaRepository<VendorReview, Long> {

    List<VendorReview> findByVendorIdOrderByCreatedAtDesc(Long vendorId);
}
