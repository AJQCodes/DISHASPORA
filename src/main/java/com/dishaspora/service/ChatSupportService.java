package com.dishaspora.service;

import com.dishaspora.dto.ChatMessageRequest;
import com.dishaspora.dto.ChatMessageResponse;
import com.dishaspora.entity.ChatMessage;
import com.dishaspora.entity.User;
import com.dishaspora.entity.Vendor;
import com.dishaspora.repository.ChatMessageRepository;
import com.dishaspora.repository.UserRepository;
import com.dishaspora.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatSupportService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository        userRepository;
    private final VendorRepository      vendorRepository;

    public List<ChatMessageResponse> getConversation(String email, UUID vendorId) {
        User user = getUser(email);
        return chatMessageRepository.findConversation(vendorId, user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ChatMessageResponse sendMessage(String email, ChatMessageRequest request) {
        User user = getUser(email);

        Vendor vendor = vendorRepository.findById(UUID.fromString(request.vendorId()))
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        if (!vendor.isApproved()) {
            throw new IllegalArgumentException("This vendor is not currently active");
        }

        ChatMessage message = ChatMessage.builder()
                .user(user)
                .vendor(vendor)
                .senderType(ChatMessage.SenderType.user)
                .message(request.message())
                .build();

        return toResponse(chatMessageRepository.save(message));
    }

    public void markConversationAsRead(String email, UUID vendorId) {
        User user = getUser(email);
        List<ChatMessage> messages = chatMessageRepository.findConversation(vendorId, user.getId());
        messages.stream()
                .filter(m -> m.getSenderType() == ChatMessage.SenderType.vendor && !m.isRead())
                .forEach(m -> m.setRead(true));
        chatMessageRepository.saveAll(messages);
    }

    public long getUnreadCount(String email) {
        User user = getUser(email);
        return chatMessageRepository.countUnreadForUser(user.getId());
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private ChatMessageResponse toResponse(ChatMessage m) {
        String senderName = m.getSenderType() == ChatMessage.SenderType.user
                ? m.getUser().getName()
                : m.getVendor().getName();
        return new ChatMessageResponse(
                m.getId().toString(),
                senderName,
                m.getSenderType().name(),
                m.getMessage(),
                m.isRead(),
                m.getSentAt().toString()
        );
    }
}
