package com.dishaspora.service;

import com.dishaspora.dto.IngredientListingRequest;
import com.dishaspora.entity.IngredientListing;
import com.dishaspora.entity.Vendor;
import com.dishaspora.repository.IngredientListingRepository;
import com.dishaspora.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IngredientListingService {

    private final IngredientListingRepository ingredientListingRepository;
    private final VendorRepository            vendorRepository;

    public List<IngredientListing> getAll(String country) {
        if (country != null && !country.isBlank()) {
            return ingredientListingRepository.findByCountryAndAvailableTrue(country);
        }
        return ingredientListingRepository.findByAvailableTrue();
    }

    public IngredientListing getById(UUID id) {
        return ingredientListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient listing not found"));
    }

    public List<IngredientListing> getByVendor(UUID vendorId) {
        return ingredientListingRepository.findByVendorId(vendorId);
    }

    public IngredientListing create(UUID vendorId, IngredientListingRequest request) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        if (!vendor.isApproved()) {
            throw new IllegalArgumentException("Vendor must be approved before creating listings");
        }
        IngredientListing listing = IngredientListing.builder()
                .vendor(vendor)
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .unit(request.unit())
                .stockQuantity(request.stockQuantity())
                .imageUrl(request.imageUrl())
                .country(request.country())
                .build();
        return ingredientListingRepository.save(listing);
    }

    public IngredientListing update(UUID id, IngredientListingRequest request) {
        IngredientListing listing = getById(id);
        listing.setName(request.name());
        listing.setDescription(request.description());
        listing.setPrice(request.price());
        listing.setUnit(request.unit());
        listing.setStockQuantity(request.stockQuantity());
        listing.setImageUrl(request.imageUrl());
        return ingredientListingRepository.save(listing);
    }

    public void delete(UUID id) {
        ingredientListingRepository.deleteById(id);
    }

    public void reduceStock(UUID id, int quantity) {
        IngredientListing listing = getById(id);
        int newStock = listing.getStockQuantity() - quantity;
        if (newStock < 0) throw new IllegalArgumentException(
                "Not enough stock for '" + listing.getName() + "'");
        listing.setStockQuantity(newStock);
        
        ingredientListingRepository.save(listing);
    }
}
