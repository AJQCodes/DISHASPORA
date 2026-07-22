package com.dishaspora.chat.service;

import com.dishaspora.auth.entity.User;
import com.dishaspora.auth.repository.UserRepository;
import com.dishaspora.chat.dto.ChatDtos.ChatMessageDto;
import com.dishaspora.chat.dto.ChatDtos.ChatThreadDto;
import com.dishaspora.chat.entity.ChatMessage;
import com.dishaspora.chat.entity.ChatThread;
import com.dishaspora.chat.repository.ChatMessageRepository;
import com.dishaspora.chat.repository.ChatThreadRepository;
import com.dishaspora.common.enums.Enums.Role;
import com.dishaspora.common.exception.ApiException;
import com.dishaspora.common.exception.NotFoundException;
import com.dishaspora.marketplace.entity.Vendor;
import com.dishaspora.marketplace.repository.VendorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ChatService {

    private static final String PREMIUM_MESSAGE =
            "Chatting with vendors is a premium feature. Subscribe to Premium to send messages.";

    private final ChatThreadRepository threadRepository;
    private final ChatMessageRepository messageRepository;
    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;

    public ChatService(ChatThreadRepository threadRepository,
                       ChatMessageRepository messageRepository,
                       VendorRepository vendorRepository,
                       UserRepository userRepository) {
        this.threadRepository = threadRepository;
        this.messageRepository = messageRepository;
        this.vendorRepository = vendorRepository;
        this.userRepository = userRepository;
    }

    public List<ChatThreadDto> threads(User user) {
        List<ChatThread> threads = new ArrayList<>(
                threadRepository.findByUserIdOrderByLastMessageAtDesc(user.getId()));
        Vendor ownVendor = vendorRepository.findByOwnerUserId(user.getId()).orElse(null);
        if (ownVendor != null) {
            for (ChatThread t : threadRepository.findByVendorIdOrderByLastMessageAtDesc(ownVendor.getId())) {
                if (threads.stream().noneMatch(existing -> Objects.equals(existing.getId(), t.getId()))) {
                    threads.add(t);
                }
            }
        }
        return threads.stream().map(t -> toThreadDto(t, user)).toList();
    }

    @Transactional
    public ChatThreadDto createThread(Long vendorId, User user) {
        requireCanPost(user);
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new NotFoundException("Vendor not found"));
        ChatThread thread = threadRepository.findByUserIdAndVendorId(user.getId(), vendorId)
                .orElseGet(() -> {
                    ChatThread t = new ChatThread();
                    t.setUserId(user.getId());
                    t.setVendorId(vendor.getId());
                    t.setLastMessageAt(Instant.now());
                    return threadRepository.save(t);
                });
        return toThreadDto(thread, user);
    }

    @Transactional
    public List<ChatMessageDto> messages(Long threadId, Long afterId, User user) {
        ChatThread thread = requireParticipant(threadId, user);
        // Mark my side as read (polling-friendly unread counters).
        if (isThreadUser(thread, user)) {
            thread.setUserLastReadAt(Instant.now());
        } else {
            thread.setVendorLastReadAt(Instant.now());
        }
        threadRepository.save(thread);

        List<ChatMessage> messages = afterId == null
                ? messageRepository.findByThreadIdOrderByIdAsc(threadId)
                : messageRepository.findByThreadIdAndIdGreaterThanOrderByIdAsc(threadId, afterId);
        return messages.stream().map(m -> toMessageDto(m, user)).toList();
    }

    @Transactional
    public ChatMessageDto sendMessage(Long threadId, String body, User user) {
        ChatThread thread = requireParticipant(threadId, user);
        requireCanPost(user);

        ChatMessage message = new ChatMessage();
        message.setThreadId(threadId);
        message.setSenderId(user.getId());
        message.setBody(body);
        message = messageRepository.save(message);

        thread.setLastMessageBody(body);
        thread.setLastMessageAt(message.getCreatedAt());
        if (isThreadUser(thread, user)) {
            thread.setUserLastReadAt(message.getCreatedAt());
        } else {
            thread.setVendorLastReadAt(message.getCreatedAt());
        }
        threadRepository.save(thread);

        return toMessageDto(message, user);
    }

    /** Plain users need active premium to post; vendors and admins are always allowed. */
    private void requireCanPost(User user) {
        if (user.getRole() == Role.ADMIN || user.getRole() == Role.VENDOR) return;
        if (vendorRepository.findByOwnerUserId(user.getId()).isPresent()) return;
        if (!user.isPremiumActive()) {
            throw ApiException.forbidden(PREMIUM_MESSAGE);
        }
    }

    private ChatThread requireParticipant(Long threadId, User user) {
        ChatThread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new NotFoundException("Chat thread not found"));
        if (user.getRole() == Role.ADMIN) return thread;
        if (isThreadUser(thread, user)) return thread;
        Vendor vendor = vendorRepository.findByOwnerUserId(user.getId()).orElse(null);
        if (vendor != null && Objects.equals(vendor.getId(), thread.getVendorId())) return thread;
        throw ApiException.forbidden("You are not a participant in this conversation");
    }

    private boolean isThreadUser(ChatThread thread, User user) {
        return Objects.equals(thread.getUserId(), user.getId());
    }

    private ChatThreadDto toThreadDto(ChatThread thread, User user) {
        Vendor vendor = vendorRepository.findById(thread.getVendorId()).orElse(null);
        Instant lastRead = isThreadUser(thread, user)
                ? thread.getUserLastReadAt() : thread.getVendorLastReadAt();
        long unread = lastRead == null
                ? messageRepository.countByThreadIdAndSenderIdNot(thread.getId(), user.getId())
                : messageRepository.countByThreadIdAndSenderIdNotAndCreatedAtAfter(
                        thread.getId(), user.getId(), lastRead);
        return new ChatThreadDto(
                thread.getId(), thread.getVendorId(),
                vendor == null ? null : vendor.getName(),
                vendor == null ? null : vendor.getLogoUrl(),
                thread.getLastMessageBody(),
                thread.getLastMessageAt() == null ? null : thread.getLastMessageAt().toString(),
                unread);
    }

    private ChatMessageDto toMessageDto(ChatMessage message, User currentUser) {
        User sender = userRepository.findById(message.getSenderId()).orElse(null);
        return new ChatMessageDto(
                message.getId(), message.getThreadId(), message.getSenderId(),
                sender == null ? "Unknown" : sender.getName(),
                Objects.equals(message.getSenderId(), currentUser.getId()),
                message.getBody(), message.getCreatedAt().toString());
    }
}
