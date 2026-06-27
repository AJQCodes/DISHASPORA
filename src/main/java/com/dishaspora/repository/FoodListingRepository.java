package com.dishaspora.repository;

import com.dishaspora.entity.FoodListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface FoodListingRepository extends JpaRepository<FoodListing, UUID> {

    @Query("SELECT f FROM FoodListing f WHERE f.country = :country AND f.availabilityStatus = 'available'")
    List<FoodListing> findByCountryAndAvailableTrue(String country);

    @Query("SELECT f FROM FoodListing f WHERE f.availabilityStatus = 'available'")
    List<FoodListing> findByAvailableTrue();

    @Query("SELECT f FROM FoodListing f WHERE f.availabilityStatus = 'available' AND f.featured = true")
    List<FoodListing> findByAvailableTrueAndFeaturedTrue();

    List<FoodListing> findByVendorId(UUID vendorId);

    long countByVendorId(UUID vendorId);
}
