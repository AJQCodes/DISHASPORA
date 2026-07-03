package com.dishaspora.auth.controller;

import com.dishaspora.auth.dto.AuthDtos.UpdateMeRequest;
import com.dishaspora.auth.dto.UserDto;
import com.dishaspora.auth.entity.User;
import com.dishaspora.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/me")
    public UserDto me(@AuthenticationPrincipal User user) {
        return UserDto.from(user);
    }

    @PutMapping("/me")
    public UserDto updateMe(@AuthenticationPrincipal User user, @Valid @RequestBody UpdateMeRequest request) {
        return authService.updateMe(user, request);
    }
}
