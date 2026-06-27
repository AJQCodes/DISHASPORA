package com.dishaspora.repository;

import com.dishaspora.entity.ContentFlag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ContentFlagRepository extends JpaRepository<ContentFlag, UUID> {
    List<ContentFlag> findByStatusOrderByCreatedAtDesc(ContentFlag.FlagStatus status);
    List<ContentFlag> findByTargetTypeAndTargetId(String targetType, UUID targetId);
}
