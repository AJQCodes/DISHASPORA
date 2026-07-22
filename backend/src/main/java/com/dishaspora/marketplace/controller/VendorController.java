package com.dishaspora.marketplace.controller;

import com.dishaspora.auth.entity.User;
import com.dishaspora.common.dto.ReviewDto;
import com.dishaspora.marketplace.dto.ListingDto;
import com.dishaspora.marketplace.dto.MarketplaceRequests.ReviewRequest;
import com.dishaspora.marketplace.dto.MarketplaceRequests.VendorApplyRequest;
import com.dishaspora.marketplace.dto.VendorDto;
import com.dishaspora.marketplace.service.ListingService;
import com.dishaspora.marketplace.service.VendorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {

    private final VendorService vendorService;
    private final ListingService listingService;

    public VendorController(VendorService vendorService, ListingService listingService) {
        this.vendorService = vendorService;
        this.listingService = listingService;
    }

    @GetMapping
    public List<VendorDto> list(@RequestParam(required = false) String country,
                                @RequestParam(required = false) String type) {
        return vendorService.list(country, type);
    }

    @GetMapping("/me")
    public VendorDto me(@AuthenticationPrincipal User user) {
        return vendorService.me(user);
    }

    @GetMapping("/{id}")
    public VendorDto get(@PathVariable Long id) {
        return VendorDto.from(vendorService.find(id));
    }

    @GetMapping("/{id}/listings")
    public List<ListingDto> listings(@PathVariable Long id) {
        return listingService.vendorListings(id);
    }

    @GetMapping("/{id}/reviews")
    public List<ReviewDto> reviews(@PathVariable Long id) {
        return vendorService.reviews(id);
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<ReviewDto> addReview(@PathVariable Long id,
                                               @Valid @RequestBody ReviewRequest request,
                                               @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vendorService.addReview(id, request, user));
    }

    @PostMapping("/apply")
    public ResponseEntity<VendorDto> apply(@Valid @RequestBody VendorApplyRequest request,
                                           @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vendorService.apply(request, user));
    }
}
