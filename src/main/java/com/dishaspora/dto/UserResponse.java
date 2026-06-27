package com.dishaspora.dto;
import com.dishaspora.entity.User;

public record UserResponse(
        String id,
        String name,
        String email,
        String country,
        String role
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId().toString(),
                user.getName(),
                user.getEmail(),
                user.getCountry(),
                user.getRole().name()
        );
    }
}
