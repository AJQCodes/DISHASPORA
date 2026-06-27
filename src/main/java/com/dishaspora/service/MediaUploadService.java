package com.dishaspora.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.dishaspora.dto.ConfirmUploadRequest;
import com.dishaspora.dto.UploadSignatureResponse;
import com.dishaspora.entity.Recipe;
import com.dishaspora.entity.RecipeMedia;
import com.dishaspora.repository.RecipeMediaRepository;
import com.dishaspora.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// MediaUploadService.java  (Direct-upload / signed-token edition)
//
// Flow overview:
//   1. Client calls  GET /api/media/recipes/{id}/video/signature
//      → backend returns a short-lived Cloudinary signature + params
//   2. Client uploads the file DIRECTLY to Cloudinary using those params
//      (the file never touches the Spring Boot server)
//   3. Client calls  POST /api/media/recipes/{id}/video/confirm
//      with the secure_url Cloudinary returned
//      → backend validates the recipe exists, then saves the URL to recipe_media
//
// Deletion still goes through the backend (we need the API secret for that).
// ─────────────────────────────────────────────────────────────────────────────
@Service
@RequiredArgsConstructor
@SuppressWarnings({"rawtypes", "unchecked"})
public class MediaUploadService {

    private final Cloudinary            cloudinary;
    private final RecipeRepository      recipeRepository;
    private final RecipeMediaRepository recipeMediaRepository;

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    // ── STEP 1 — Generate a signed upload token for a recipe VIDEO ─────────────
    public UploadSignatureResponse generateVideoSignature(UUID recipeId) {
        assertRecipeExists(recipeId);

        String folder   = "dishaspora/recipe-videos";
        String publicId = recipeId.toString();

        return buildSignature(folder, publicId, "video");
    }

    // ── STEP 1 — Generate a signed upload token for a recipe AUDIO ─────────────
    public UploadSignatureResponse generateAudioSignature(UUID recipeId) {
        assertRecipeExists(recipeId);

        String folder   = "dishaspora/recipe-audio";
        String publicId = recipeId.toString() + "-audio";

        return buildSignature(folder, publicId, "video"); // Cloudinary treats audio as resource_type "video"
    }

    // ── STEP 3 — Save the Cloudinary URL returned after a VIDEO direct-upload ───
    public String confirmVideoUpload(UUID recipeId, ConfirmUploadRequest request) {
        Recipe recipe = findRecipe(recipeId);

        // Remove any previous video row so there is only ever one per recipe
        recipeMediaRepository.findByRecipeIdAndMediaType(recipeId, "VIDEO")
                .forEach(recipeMediaRepository::delete);

        recipeMediaRepository.save(RecipeMedia.builder()
                .recipe(recipe)
                .mediaType("VIDEO")
                .mediaUrl(request.getMediaUrl())
                .build());

        return request.getMediaUrl();
    }

    // ── STEP 3 — Save the Cloudinary URL returned after an AUDIO direct-upload ──
    public String confirmAudioUpload(UUID recipeId, ConfirmUploadRequest request) {
        Recipe recipe = findRecipe(recipeId);

        recipeMediaRepository.findByRecipeIdAndMediaType(recipeId, "AUDIO")
                .forEach(recipeMediaRepository::delete);

        recipeMediaRepository.save(RecipeMedia.builder()
                .recipe(recipe)
                .mediaType("AUDIO")
                .mediaUrl(request.getMediaUrl())
                .build());

        return request.getMediaUrl();
    }

    // ── Delete a recipe's VIDEO from Cloudinary and the database ──────────────
    public void deleteRecipeVideo(UUID recipeId) throws IOException {
        assertRecipeExists(recipeId);

        cloudinary.uploader().destroy(
                recipeId.toString(),
                ObjectUtils.asMap("resource_type", "video")
        );

        recipeMediaRepository.findByRecipeIdAndMediaType(recipeId, "VIDEO")
                .forEach(recipeMediaRepository::delete);
    }

    // ── Delete a recipe's AUDIO from Cloudinary and the database ──────────────
    public void deleteRecipeAudio(UUID recipeId) throws IOException {
        assertRecipeExists(recipeId);

        cloudinary.uploader().destroy(
                recipeId.toString() + "-audio",
                ObjectUtils.asMap("resource_type", "video")
        );

        recipeMediaRepository.findByRecipeIdAndMediaType(recipeId, "AUDIO")
                .forEach(recipeMediaRepository::delete);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Builds a Cloudinary signed-upload parameter set.
     * The signature is an HMAC-SHA1 of the upload params + the API secret.
     * It expires after 1 hour (Cloudinary enforces this server-side).
     */
    private UploadSignatureResponse buildSignature(String folder, String publicId, String resourceType) {
        long timestamp = System.currentTimeMillis() / 1000L;

        // Parameters that MUST match what the client sends with the file
        Map paramsToSign = ObjectUtils.asMap(
                "folder",    folder,
                "public_id", publicId,
                "timestamp", timestamp
        );

        String signature = cloudinary.apiSignRequest(paramsToSign, cloudinary.config.apiSecret);

        return UploadSignatureResponse.builder()
                .cloudName(cloudName)
                .apiKey(apiKey)
                .timestamp(timestamp)
                .signature(signature)
                .folder(folder)
                .publicId(publicId)
                .resourceType(resourceType)
                .build();
    }

    private Recipe findRecipe(UUID recipeId) {
        return recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found: " + recipeId));
    }

    private void assertRecipeExists(UUID recipeId) {
        if (!recipeRepository.existsById(recipeId)) {
            throw new RuntimeException("Recipe not found: " + recipeId);
        }
    }
}
