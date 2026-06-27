package com.dishaspora.service;

import com.dishaspora.entity.Country;
import com.dishaspora.repository.CountryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// ─────────────────────────────────────────────────────────────────────────────
// CountryService.java
// Returns the list of active countries seeded from seed_countries_and_categories.sql
// Used by the frontend to populate country dropdowns during registration,
// vendor setup, and listing creation.
// ─────────────────────────────────────────────────────────────────────────────
@Service
@RequiredArgsConstructor
public class CountryService {

    private final CountryRepository countryRepository;

    // ── All active countries (sorted alphabetically by name) ──────────────────
    public List<Country> getActiveCountries() {
        return countryRepository.findByActiveTrue()
                .stream()
                .sorted((a, b) -> a.getName().compareToIgnoreCase(b.getName()))
                .toList();
    }
}
