package com.dishaspora.controller;

import com.dishaspora.dto.ChatMessageRequest;
import com.dishaspora.dto.ChatMessageResponse;
import com.dishaspora.service.ChatSupportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatSupportController {

    private final ChatSupportService chatSupportService;

    // GET /api/chat/{vendorId} — get conversation with a vendor
    @GetMapping("/{vendorId}")
    public ResponseEntity<List<ChatMessageResponse>> getConversation(
            @PathVariable UUID vendorId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatSupportService.getConversation(userDetails.getUsername(), vendorId));
    }

    // POST /api/chat — send a message to a vendor
    @PostMapping
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @Valid @RequestBody ChatMessageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatSupportService.sendMessage(userDetails.getUsername(), request));
    }

    // PATCH /api/chat/{vendorId}/read — mark conversation as read
    @PatchMapping("/{vendorId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable UUID vendorId,
            @AuthenticationPrincipal UserDetails userDetails) {
        chatSupportService.markConversationAsRead(userDetails.getUsername(), vendorId);
        return ResponseEntity.ok().build();
    }

    // GET /api/chat/unread-count
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(Map.of("unreadCount",
                chatSupportService.getUnreadCount(userDetails.getUsername())));
    }
}
