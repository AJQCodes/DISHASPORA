package com.dishaspora.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// ─────────────────────────────────────────────────────────────────────────────
// UploadSignatureResponse.java
// Sent back to the client so it can upload a file directly to Cloudinary
// without the file ever passing through the backend.
//
// The client posts to:
//   https://api.cloudinary.com/v1_1/{cloudName}/{resourceType}/upload
// with these fields as form data, plus the actual file.
// ─────────────────────────────────────────────────────────────────────────────
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UploadSignatureResponse {

    /** Your Cloudinary cloud name — needed by the client to form the upload URL. */
    private String cloudName;

    /** API key (public — safe to expose). */
    private String apiKey;

    /** UNIX timestamp used when computing the signature (must match). */
    private long timestamp;

    /** HMAC-SHA1 signature the client passes to Cloudinary to prove the upload is authorised. */
    private String signature;

    /** Folder the file will be placed in on Cloudinary (e.g. "dishaspora/recipe-videos"). */
    private String folder;

    /** Public ID the file will be stored under on Cloudinary. */
    private String publicId;

    /** "video" or "image" — tells the client which Cloudinary upload endpoint to use. */
    private String resourceType;
}
