package com.dishaspora.controller;

import com.dishaspora.dto.IngredientListingRequest;
import com.dishaspora.entity.IngredientListing;
import com.dishaspora.service.IngredientListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
public class IngredientListingController {

    private final IngredientListingService ingredientListingService;

    // GET /api/ingredients?country=GH
    @GetMapping
    public ResponseEntity<List<IngredientListing>> getAll(
            @RequestParam(required = false) String country) {
        return ResponseEntity.ok(ingredientListingService.getAll(country));
    }

    // GET /api/ingredients/{id}
    @GetMapping("/{id}")
    public ResponseEntity<IngredientListing> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ingredientListingService.getById(id));
    }

    // GET /api/ingredients/vendor/{vendorId}
    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<IngredientListing>> getByVendor(@PathVariable UUID vendorId) {
        return ResponseEntity.ok(ingredientListingService.getByVendor(vendorId));
    }

    // POST /api/ingredients/{vendorId}
    @PostMapping("/{vendorId}")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<IngredientListing> create(
            @PathVariable UUID vendorId,
            @Valid @RequestBody IngredientListingRequest request) {
        return ResponseEntity.ok(ingredientListingService.create(vendorId, request));
    }

    // PUT /api/ingredients/{id}
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<IngredientListing> update(
            @PathVariable UUID id,
            @Valid @RequestBody IngredientListingRequest request) {
        return ResponseEntity.ok(ingredientListingService.update(id, request));
    }

    // DELETE /api/ingredients/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        ingredientListingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
