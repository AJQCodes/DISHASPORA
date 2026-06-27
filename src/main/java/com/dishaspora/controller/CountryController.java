package com.dishaspora.controller;

import com.dishaspora.entity.Country;
import com.dishaspora.service.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ─────────────────────────────────────────────────────────────────────────────
// CountryController.java
// Public endpoint — no JWT required.
// The frontend calls this to populate country dropdowns on:
//   - Registration screen
//   - Vendor setup screen
//   - Create/edit listing screen
//
// GET /api/countries
// Returns all 195 active countries sorted alphabetically.
// Response: [ { "id": 1, "name": "Ghana", "code": "GH", "active": true }, ... ]
// ─────────────────────────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/countries")
@RequiredArgsConstructor
public class CountryController {

    private final CountryService countryService;

    @GetMapping
    public ResponseEntity<List<Country>> getCountries() {
        return ResponseEntity.ok(countryService.getActiveCountries());
    }
}
