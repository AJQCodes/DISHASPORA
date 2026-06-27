package com.dishaspora.repository;

import com.dishaspora.entity.VendorDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface VendorDocumentRepository extends JpaRepository<VendorDocument, UUID> {
    List<VendorDocument> findByVendorId(UUID vendorId);
    List<VendorDocument> findByVerificationStatus(VendorDocument.VerificationStatus status);
}
