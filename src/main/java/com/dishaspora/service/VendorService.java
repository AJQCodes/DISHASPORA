package com.dishaspora.service;

import com.dishaspora.entity.User;
import com.dishaspora.entity.Vendor;
import com.dishaspora.repository.UserRepository;
import com.dishaspora.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;

    public List<Vendor> getAll(String country) {
        if (country != null) {
            return vendorRepository.findByApprovalStatusAndCountry(
                    Vendor.ApprovalStatus.approved, country
            );
        }
        return vendorRepository.findByApprovalStatus(Vendor.ApprovalStatus.approved);
    }

    public Vendor getById(UUID id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
    }

    public Vendor register(Vendor vendor, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (vendorRepository.findByUserId(user.getId()).isPresent()) {
            throw new IllegalArgumentException("User is already a vendor");
        }

        vendor.setUser(user);
        vendor.setApprovalStatus(Vendor.ApprovalStatus.pending);
        Vendor saved = vendorRepository.save(vendor);

        user.setRole(User.Role.vendor);
        userRepository.save(user);

        return saved;
    }

    public List<Vendor> getPending() {
        return vendorRepository.findByApprovalStatus(Vendor.ApprovalStatus.pending);
    }

    public Vendor approve(UUID id) {
        Vendor vendor = getById(id);
        vendor.setApprovalStatus(Vendor.ApprovalStatus.approved);
        return vendorRepository.save(vendor);
    }

    public Vendor reject(UUID id, String reason) {
        Vendor vendor = getById(id);
        vendor.setApprovalStatus(Vendor.ApprovalStatus.rejected);
        vendor.setRejectionReason(reason);
        return vendorRepository.save(vendor);
    }
}
