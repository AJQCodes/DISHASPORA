package com.dishaspora.service;

import com.dishaspora.dto.NotificationResponse;
import com.dishaspora.entity.Notification;
import com.dishaspora.entity.User;
import com.dishaspora.repository.NotificationRepository;
import com.dishaspora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository         userRepository;

    // ── Get all notifications for logged-in user ───────────────────────────────
    public List<NotificationResponse> getMyNotifications(String email) {
        User user = getUser(email);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Get unread count (for the bell badge) ─────────────────────────────────
    public long getUnreadCount(String email) {
        User user = getUser(email);
        return notificationRepository.countByUserIdAndReadFalse(user.getId());
    }

    // ── Mark a notification as read ────────────────────────────────────────────
    public void markAsRead(String email, UUID notificationId) {
        User user = getUser(email);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("This notification does not belong to you");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    // ── Mark all as read ───────────────────────────────────────────────────────
    public void markAllAsRead(String email) {
        User user = getUser(email);
        List<Notification> unread = notificationRepository
                .findByUserIdAndReadFalseOrderByCreatedAtDesc(user.getId());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    // ── Internal: send a notification (called by other services) ─────────────
    public void send(User user, String title, String message, String type) {
        notificationRepository.save(Notification.builder()
                .user(user).title(title).message(message).notificationType(Notification.NotificationType.valueOf(type.toUpperCase())).build());
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(
                n.getId().toString(), n.getTitle(), n.getMessage(),
                n.getNotificationType().name(), n.isRead(), n.getCreatedAt().toString());
    }
}
