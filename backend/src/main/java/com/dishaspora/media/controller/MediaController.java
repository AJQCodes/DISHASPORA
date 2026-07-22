package com.dishaspora.media.controller;

import com.dishaspora.common.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("mp4", "mp3", "jpg", "jpeg", "png");

    private final Path uploadDir;

    public MediaController(@Value("${media.upload-dir:./uploads}") String uploadDir) {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> upload(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("No file provided");
        }
        String original = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        int dot = original.lastIndexOf('.');
        String extension = dot < 0 ? "" : original.substring(dot + 1).toLowerCase(Locale.ROOT);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw ApiException.badRequest("File type not allowed. Allowed: mp4, mp3, jpg, jpeg, png");
        }
        try {
            Files.createDirectories(uploadDir);
            String filename = UUID.randomUUID() + "." + extension;
            file.transferTo(uploadDir.resolve(filename).toFile());
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("url", "/uploads/" + filename));
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not store file: " + e.getMessage());
        }
    }
}
