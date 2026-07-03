package com.dishaspora.marketplace.service;

import com.dishaspora.auth.entity.User;
import com.dishaspora.auth.repository.UserRepository;
import com.dishaspora.common.dto.ReviewDto;
import com.dishaspora.common.enums.Enums.ApprovalStatus;
import com.dishaspora.common.enums.Enums.VendorType;
import com.dishaspora.common.exception.ApiException;
import com.dishaspora.common.exception.NotFoundException;
import com.dishaspora.marketplace.dto.MarketplaceRequests.ReviewRequest;
import com.dishaspora.marketplace.dto.MarketplaceRequests.VendorApplyRequest;
import com.dishaspora.marketplace.dto.VendorDto;
import com.dishaspora.marketplace.entity.Vendor;
import com.dishaspora.marketplace.entity.VendorReview;
import com.dishaspora.marketplace.repository.VendorRepository;
import com.dishaspora.marketplace.repository.VendorReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VendorService {

    private final VendorRepository vendorRepository;
    private final VendorReviewRepository vendorReviewRepository;
    private final UserRepository userRepository;

    public VendorService(VendorRepository vendorRepository,
                         VendorReviewRepository vendorReviewRepository,
                         UserRepository userRepository) {
        this.vendorRepository = vendorRepository;
        this.vendorReviewRepository = vendorReviewRepository;
        this.userRepository = userRepository;
    }

    public List<VendorDto> list(String country, String type) {
        VendorType vendorType = null;
        if (type != null && !type.isBlank()) {
            try {
                vendorType = VendorType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw ApiException.badRequest("Invalid vendor type: " + type);
            }
        }
        List<Vendor> vendors;
        boolean hasCountry = country != null && !country.isBlank();
        if (hasCountry && vendorType != null) {
            vendors = vendorRepository.findByStatusAndCountryAndType(ApprovalStatus.APPROVED, country, vendorType);
        } else if (hasCountry) {
            vendors = vendorRepository.findByStatusAndCountry(ApprovalStatus.APPROVED, country);
        } else if (vendorType != null) {
            vendors = vendorRepository.findByStatusAndType(ApprovalStatus.APPROVED, vendorType);
        } else {
            vendors = vendorRepository.findByStatus(ApprovalStatus.APPROVED);
        }
        return vendors.stream().map(VendorDto::from).toList();
    }

    public Vendor find(Long id) {
        return vendorRepository.findById(id).orElseThrow(() -> new NotFoundException("Vendor not found"));
    }

    @Transactional
    public VendorDto apply(VendorApplyRequest request, User user) {
        if (vendorRepository.findByOwnerUserId(user.getId()).isPresent()) {
            throw ApiException.conflict("You already have a vendor profile");
        }
        Vendor vendor = new Vendor();
        vendor.setOwnerUserId(user.getId());
        vendor.setName(request.name());
        vendor.setBio(request.bio());
        vendor.setType(VendorType.valueOf(request.type()));
        vendor.setSpecialty(request.specialty());
        vendor.setLocation(request.location());
        vendor.setPhone(request.phone());
        vendor.setLogoUrl(request.logoUrl() != null ? request.logoUrl() : "/images/vendor-1.png");
        vendor.setCoverUrl(request.coverUrl() != null ? request.coverUrl() : "/images/banner-1.png");
        vendor.setCountry(user.getCountry());
        vendor.setStatus(ApprovalStatus.PENDING);
        vendor = vendorRepository.save(vendor);

        User owner = userRepository.findById(user.getId()).orElseThrow();
        owner.setVendorId(vendor.getId());
        userRepository.save(owner);

        return VendorDto.from(vendor);
    }

    public VendorDto me(User user) {
        Vendor vendor = vendorRepository.findByOwnerUserId(user.getId())
                .orElseThrow(() -> new NotFoundException("You do not have a vendor profile"));
        return VendorDto.from(vendor);
    }

    public List<ReviewDto> reviews(Long vendorId) {
        find(vendorId);
        return vendorReviewRepository.findByVendorIdOrderByCreatedAtDesc(vendorId).stream()
                .map(this::toReviewDto)
                .toList();
    }

    @Transactional
    public ReviewDto addReview(Long vendorId, ReviewRequest request, User user) {
        Vendor vendor = find(vendorId);
        VendorReview review = new VendorReview();
        review.setVendorId(vendorId);
        review.setUserId(user.getId());
        review.setRating(request.rating());
        review.setComment(request.comment());
        review = vendorReviewRepository.save(review);

        double total = vendor.getRating() * vendor.getReviewCount() + request.rating();
        vendor.setReviewCount(vendor.getReviewCount() + 1);
        vendor.setRating(total / vendor.getReviewCount());
        vendorRepository.save(vendor);

        return toReviewDto(review);
    }

    private ReviewDto toReviewDto(VendorReview review) {
        User author = userRepository.findById(review.getUserId()).orElse(null);
        return new ReviewDto(review.getId(), review.getRating(), review.getComment(),
                author == null ? "Unknown" : author.getName(),
                author == null ? null : author.getAvatarUrl(),
                review.getCreatedAt().toString());
    }
}
