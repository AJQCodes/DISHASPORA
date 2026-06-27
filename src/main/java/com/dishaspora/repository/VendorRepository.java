package com.dishaspora.repository;

// ─────────────────────────────────────────────────────────────────────────────
// VendorRepository.java
// FIX: Moved VendorRepository to its own file and made it public
// Previously it was a package-private interface inside RecipeRepository.java
// which prevented VendorService and AdminService from injecting it
// ─────────────────────────────────────────────────────────────────────────────
import com.dishaspora.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VendorRepository extends JpaRepository<Vendor, UUID> {

    // ── Find vendors by their approval status ─────────────────────────────
    List<Vendor> findByApprovalStatus(Vendor.ApprovalStatus status);

    // ── Find approved vendors in a specific country ───────────────────────
    List<Vendor> findByApprovalStatusAndCountry(Vendor.ApprovalStatus status, String country);

    // ── Find a vendor by the user who owns it ─────────────────────────────
    Optional<Vendor> findByUserId(UUID userId);
}
