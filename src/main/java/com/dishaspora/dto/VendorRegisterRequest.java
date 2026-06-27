package com.dishaspora.dto;

public record VendorRegisterRequest(
        String name,
        String description,
        String country,
        String city
) {}
