package com.dishaspora.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {}

    public record RegisterRequest(
            @NotBlank String name,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 6, max = 100) String password,
            @NotBlank @Pattern(regexp = "GH|NG", message = "must be GH or NG") String country) {}

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password) {}

    public record AuthResponse(String token, UserDto user) {}

    public record UpdateMeRequest(String name, String avatarUrl,
            @Pattern(regexp = "GH|NG", message = "must be GH or NG") String country) {}
}
