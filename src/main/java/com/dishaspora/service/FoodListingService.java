package com.dishaspora.service;

import com.dishaspora.dto.FoodListingRequest;
import com.dishaspora.entity.FoodListing;
import com.dishaspora.entity.Vendor;
import com.dishaspora.repository.FoodListingRepository;
import com.dishaspora.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FoodListingService {

    private final FoodListingRepository foodListingRepository;
    private final VendorRepository      vendorRepository;

    public List<FoodListing> getListings(String country) {
        if (country != null && !country.isBlank()) {
            return foodListingRepository.findByCountryAndAvailableTrue(country);
        }
        return foodListingRepository.findByAvailableTrue();
    }

    public FoodListing getById(UUID id) {
        return foodListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
    }

    public List<FoodListing> getByVendor(UUID vendorId) {
        return foodListingRepository.findByVendorId(vendorId);
    }

    public FoodListing create(UUID vendorId, FoodListingRequest request) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        if (!vendor.isApproved()) {
            throw new IllegalArgumentException("Vendor must be approved before creating listings");
        }

        FoodListing listing = FoodListing.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .country(request.country())
                .stockQuantity(request.stockQuantity())
                .imageUrl(request.imageUrl())
                .vendor(vendor)
                .build();

        return foodListingRepository.save(listing);
    }

    public FoodListing update(UUID id, FoodListingRequest request) {
        FoodListing listing = getById(id);
        listing.setName(request.name());
        listing.setDescription(request.description());
        listing.setPrice(request.price());
        listing.setStockQuantity(request.stockQuantity());
        listing.setImageUrl(request.imageUrl());
        return foodListingRepository.save(listing);
    }

    public void reduceStock(UUID listingId, int quantity) {
        FoodListing listing = getById(listingId);
        int newStock = listing.getStockQuantity() - quantity;
        if (newStock < 0) throw new IllegalArgumentException("Not enough stock for '" + listing.getName() + "'");
        listing.setStockQuantity(newStock);
        if (newStock == 0) listing.setAvailabilityStatus("sold_out");
        foodListingRepository.save(listing);
    }

    public void delete(UUID id) {
        foodListingRepository.deleteById(id);
    }
}
