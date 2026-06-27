package com.dishaspora.repository;

import com.dishaspora.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {

    @Query("SELECT m FROM ChatMessage m WHERE m.vendor.id = :vendorId AND m.user.id = :userId ORDER BY m.sentAt ASC")
    List<ChatMessage> findConversation(UUID vendorId, UUID userId);

    // Count unread messages sent by vendor to this user
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.user.id = :userId AND m.senderType = 'vendor' AND m.read = false")
    long countUnreadForUser(UUID userId);
}
