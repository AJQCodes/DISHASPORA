package com.dishaspora.auth.service;

import com.dishaspora.auth.dto.AuthDtos.AuthResponse;
import com.dishaspora.auth.dto.AuthDtos.LoginRequest;
import com.dishaspora.auth.dto.AuthDtos.RegisterRequest;
import com.dishaspora.auth.dto.AuthDtos.UpdateMeRequest;
import com.dishaspora.auth.dto.UserDto;
import com.dishaspora.auth.entity.User;
import com.dishaspora.auth.repository.UserRepository;
import com.dishaspora.common.enums.Enums.Role;
import com.dishaspora.common.exception.ApiException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw ApiException.conflict("An account with this email already exists");
        }
        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);
        user.setCountry(request.country());
        user.setAvatarUrl("/images/avatar-" + (1 + (int) (Math.random() * 8)) + ".png");
        user = userRepository.save(user);
        return new AuthResponse(jwtService.generateToken(user), UserDto.from(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> ApiException.unauthorized("Invalid email or password"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw ApiException.unauthorized("Invalid email or password");
        }
        if (user.isBanned()) {
            throw ApiException.forbidden("Your account has been banned. Contact support.");
        }
        return new AuthResponse(jwtService.generateToken(user), UserDto.from(user));
    }

    @Transactional
    public UserDto updateMe(User current, UpdateMeRequest request) {
        User user = userRepository.findById(current.getId())
                .orElseThrow(() -> ApiException.unauthorized("User not found"));
        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name());
        }
        if (request.avatarUrl() != null && !request.avatarUrl().isBlank()) {
            user.setAvatarUrl(request.avatarUrl());
        }
        if (request.country() != null && !request.country().isBlank()) {
            user.setCountry(request.country());
        }
        return UserDto.from(userRepository.save(user));
    }
}
