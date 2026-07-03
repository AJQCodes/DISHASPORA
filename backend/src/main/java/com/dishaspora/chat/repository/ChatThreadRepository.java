package com.dishaspora.chat.repository;

import com.dishaspora.chat.entity.ChatThread;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatThreadRepository extends JpaRepository<ChatThread, Long> {

    Optional<ChatThread> findByUserIdAndVendorId(Long userId, Long vendorId);

    List<ChatThread> findByUserIdOrderByLastMessageAtDesc(Long userId);

    List<ChatThread> findByVendorIdOrderByLastMessageAtDesc(Long vendorId);
}
