package com.dishaspora.marketplace.dto;

import com.dishaspora.marketplace.entity.Listing;
import com.dishaspora.marketplace.entity.Vendor;

public record ListingDto(Long id, String type, String title, String description, String imageUrl,
                         long amountMinor, String currency, Long compareAtMinor, String country,
                         boolean available, int stockQty, String quantity, String unit, Integer prepMinutes,
                         Long vendorId, String vendorName, String vendorLogoUrl,
                         String status, Long linkedRecipeId) {

    public static ListingDto from(Listing l, Vendor vendor) {
        return new ListingDto(l.getId(), l.getType().name(), l.getTitle(), l.getDescription(), l.getImageUrl(),
                l.getAmountMinor(), l.getCurrency(), l.getCompareAtMinor(), l.getCountry(),
                l.isAvailable(), l.getStockQty(), l.getQuantity(), l.getUnit(), l.getPrepMinutes(),
                l.getVendorId(),
                vendor == null ? null : vendor.getName(),
                vendor == null ? null : vendor.getLogoUrl(),
                l.getStatus().name(), l.getLinkedRecipeId());
    }
}
