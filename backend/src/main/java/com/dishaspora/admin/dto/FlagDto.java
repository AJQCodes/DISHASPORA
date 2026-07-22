package com.dishaspora.admin.dto;

import com.dishaspora.admin.entity.Flag;

public record FlagDto(Long id, String type, String targetType, Long targetId, String targetTitle,
                      String detail, boolean resolved, String createdAt) {

    public static FlagDto from(Flag f) {
        return new FlagDto(f.getId(), f.getType().name(), f.getTargetType().name(), f.getTargetId(),
                f.getTargetTitle(), f.getDetail(), f.isResolved(), f.getCreatedAt().toString());
    }
}
