package com.dishaspora.admin.entity;

import com.dishaspora.common.enums.Enums.FlagTargetType;
import com.dishaspora.common.enums.Enums.FlagType;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "flags")
public class Flag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FlagType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FlagTargetType targetType;

    @Column(nullable = false)
    private Long targetId;

    private String targetTitle;

    @Column(length = 1000)
    private String detail;

    private boolean resolved;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Flag() {}

    public Flag(FlagType type, FlagTargetType targetType, Long targetId, String targetTitle, String detail) {
        this.type = type;
        this.targetType = targetType;
        this.targetId = targetId;
        this.targetTitle = targetTitle;
        this.detail = detail;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public FlagType getType() { return type; }
    public void setType(FlagType type) { this.type = type; }
    public FlagTargetType getTargetType() { return targetType; }
    public void setTargetType(FlagTargetType targetType) { this.targetType = targetType; }
    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }
    public String getTargetTitle() { return targetTitle; }
    public void setTargetTitle(String targetTitle) { this.targetTitle = targetTitle; }
    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }
    public boolean isResolved() { return resolved; }
    public void setResolved(boolean resolved) { this.resolved = resolved; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
