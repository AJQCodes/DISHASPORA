package com.dishaspora.controller;

import com.dishaspora.dto.ConfirmUploadRequest;
import com.dishaspora.dto.UploadSignatureResponse;
import com.dishaspora.service.MediaUploadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// MediaController.java  (Direct-upload edition)
//
// Direct-upload flow — two steps per media type:
//
//   STEP 1  GET  /api/media/recipes/{id}/video/signature
//           → Returns a signed token. Client uses it to upload DIRECTLY to
//             Cloudinary. The actual file never reaches this server.
//
//   STEP 2  POST /api/media/recipes/{id}/video/confirm
//           Body: { "mediaUrl": "...", "publicId": "..." }
//           → Client sends back the secure_url Cloudinary returned so we can
//             persist it in the recipe_media table.
//
// Same two steps apply for audio (/audio/signature and /audio/confirm).
// Deletion still goes through the backend — we need the API secret for that.
// ─────────────────────────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaUploadService mediaUploadService;

    // ── VIDEO: STEP 1 — get a signed upload token ──────────────────────────────
    @GetMapping("/recipes/{recipeId}/video/signature")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<UploadSignatureResponse> getVideoSignature(
            @PathVariable UUID recipeId) {

        UploadSignatureResponse response = mediaUploadService.generateVideoSignature(recipeId);
        return ResponseEntity.ok(response);
    }

    // ── VIDEO: STEP 2 — save the Cloudinary URL after the client uploaded ──────
    @PostMapping("/recipes/{recipeId}/video/confirm")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<Map<String, String>> confirmVideoUpload(
            @PathVariable UUID recipeId,
            @Valid @RequestBody ConfirmUploadRequest request) {

        String videoUrl = mediaUploadService.confirmVideoUpload(recipeId, request);
        return ResponseEntity.ok(Map.of("videoUrl", videoUrl));
    }

    // ── AUDIO: STEP 1 — get a signed upload token ──────────────────────────────
    @GetMapping("/recipes/{recipeId}/audio/signature")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<UploadSignatureResponse> getAudioSignature(
            @PathVariable UUID recipeId) {

        UploadSignatureResponse response = mediaUploadService.generateAudioSignature(recipeId);
        return ResponseEntity.ok(response);
    }

    // ── AUDIO: STEP 2 — save the Cloudinary URL after the client uploaded ──────
    @PostMapping("/recipes/{recipeId}/audio/confirm")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<Map<String, String>> confirmAudioUpload(
            @PathVariable UUID recipeId,
            @Valid @RequestBody ConfirmUploadRequest request) {

        String audioUrl = mediaUploadService.confirmAudioUpload(recipeId, request);
        return ResponseEntity.ok(Map.of("audioUrl", audioUrl));
    }

    // ── Delete video from Cloudinary + database ────────────────────────────────
    @DeleteMapping("/recipes/{recipeId}/video")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<Void> deleteVideo(@PathVariable UUID recipeId) throws IOException {
        mediaUploadService.deleteRecipeVideo(recipeId);
        return ResponseEntity.noContent().build();
    }

    // ── Delete audio from Cloudinary + database ────────────────────────────────
    @DeleteMapping("/recipes/{recipeId}/audio")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<Void> deleteAudio(@PathVariable UUID recipeId) throws IOException {
        mediaUploadService.deleteRecipeAudio(recipeId);
        return ResponseEntity.noContent().build();
    }
}
