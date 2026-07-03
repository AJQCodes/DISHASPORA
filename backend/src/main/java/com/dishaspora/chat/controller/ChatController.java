package com.dishaspora.chat.controller;

import com.dishaspora.auth.entity.User;
import com.dishaspora.chat.dto.ChatDtos.ChatMessageDto;
import com.dishaspora.chat.dto.ChatDtos.ChatThreadDto;
import com.dishaspora.chat.dto.ChatDtos.CreateThreadRequest;
import com.dishaspora.chat.dto.ChatDtos.SendMessageRequest;
import com.dishaspora.chat.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/threads")
    public List<ChatThreadDto> threads(@AuthenticationPrincipal User user) {
        return chatService.threads(user);
    }

    @PostMapping("/threads")
    public ResponseEntity<ChatThreadDto> createThread(@Valid @RequestBody CreateThreadRequest request,
                                                      @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(chatService.createThread(request.vendorId(), user));
    }

    @GetMapping("/threads/{id}/messages")
    public List<ChatMessageDto> messages(@PathVariable Long id,
                                         @RequestParam(required = false) Long after,
                                         @AuthenticationPrincipal User user) {
        return chatService.messages(id, after, user);
    }

    @PostMapping("/threads/{id}/messages")
    public ResponseEntity<ChatMessageDto> send(@PathVariable Long id,
                                               @Valid @RequestBody SendMessageRequest request,
                                               @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(chatService.sendMessage(id, request.body(), user));
    }
}
