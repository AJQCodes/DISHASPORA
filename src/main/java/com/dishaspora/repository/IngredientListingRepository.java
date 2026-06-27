package com.dishaspora.repository;

import com.dishaspora.entity.IngredientListing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface IngredientListingRepository extends JpaRepository<IngredientListing, UUID> {
    List<IngredientListing> findByAvailableTrue();
    List<IngredientListing> findByCountryAndAvailableTrue(String country);
    List<IngredientListing> findByVendorId(UUID vendorId);
}
