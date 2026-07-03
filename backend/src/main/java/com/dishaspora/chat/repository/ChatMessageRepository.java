package com.dishaspora.chat.repository;

import com.dishaspora.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByThreadIdOrderByIdAsc(Long threadId);

    List<ChatMessage> findByThreadIdAndIdGreaterThanOrderByIdAsc(Long threadId, Long afterId);

    long countByThreadIdAndSenderIdNotAndCreatedAtAfter(Long threadId, Long senderId, Instant after);

    long countByThreadIdAndSenderIdNot(Long threadId, Long senderId);
}
