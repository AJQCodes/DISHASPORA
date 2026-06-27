package com.dishaspora.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// ─────────────────────────────────────────────────────────────────────────────
// ConfirmUploadRequest.java
// After the client has uploaded directly to Cloudinary it calls
// POST /api/media/recipes/{recipeId}/video/confirm (or /audio/confirm)
// with this body so the backend can save the resulting URL.
// ─────────────────────────────────────────────────────────────────────────────
@Getter
@Setter
@NoArgsConstructor
public class ConfirmUploadRequest {

    /** The secure_url returned by Cloudinary after a successful direct upload. */
    @NotBlank(message = "mediaUrl must not be blank")
    private String mediaUrl;

    /** The public_id returned by Cloudinary (used later for deletion). */
    @NotBlank(message = "publicId must not be blank")
    private String publicId;
}
