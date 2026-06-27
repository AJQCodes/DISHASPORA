package com.dishaspora.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// ─────────────────────────────────────────────────────────────────────────────
// CloudinaryConfig.java
// Sets up the Cloudinary client bean used by MediaUploadService to:
//   - Generate signed upload tokens (STEP 1)
//   - Delete files from Cloudinary when requested
//
// The API secret is only ever used server-side — it is never sent to clients.
// Files are uploaded directly from the client to Cloudinary using a short-lived
// signature, so large video/audio bytes never pass through this server.
//
// Add these three lines to application.properties before running:
//   cloudinary.cloud-name=your-cloud-name
//   cloudinary.api-key=your-api-key
//   cloudinary.api-secret=your-api-secret
// ─────────────────────────────────────────────────────────────────────────────
@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key",    apiKey,
                "api_secret", apiSecret,
                "secure",     true
        ));
    }
}
