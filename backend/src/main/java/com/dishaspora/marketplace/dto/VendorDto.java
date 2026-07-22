package com.dishaspora.marketplace.dto;

import com.dishaspora.marketplace.entity.Vendor;

public record VendorDto(Long id, String name, String bio, String country, String logoUrl, String coverUrl,
                        String type, String status, String rejectionFeedback, double rating, int reviewCount,
                        String specialty, String location, String phone) {

    public static VendorDto from(Vendor v) {
        return new VendorDto(v.getId(), v.getName(), v.getBio(), v.getCountry(), v.getLogoUrl(), v.getCoverUrl(),
                v.getType().name(), v.getStatus().name(), v.getRejectionFeedback(),
                Math.round(v.getRating() * 10.0) / 10.0, v.getReviewCount(),
                v.getSpecialty(), v.getLocation(), v.getPhone());
    }
}
