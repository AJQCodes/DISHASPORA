package com.dishaspora.repository;

import com.dishaspora.entity.AdminAction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AdminActionRepository extends JpaRepository<AdminAction, UUID> {
    List<AdminAction> findByAdminIdOrderByCreatedAtDesc(UUID adminId);
    List<AdminAction> findByTargetTypeAndTargetId(String targetType, UUID targetId);
}
