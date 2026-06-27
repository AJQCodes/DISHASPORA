package com.dishaspora.controller;

import com.dishaspora.entity.Recipe;
import com.dishaspora.entity.Vendor;
import com.dishaspora.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ── Stats ─────────────────────────────────────────────────────────────────

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    // ── Vendor Approvals ──────────────────────────────────────────────────────

    @GetMapping("/vendors/pending")
    public ResponseEntity<List<Vendor>> getPendingVendors() {
        return ResponseEntity.ok(adminService.getPendingVendors());
    }

    @PostMapping("/vendors/{id}/approve")
    public ResponseEntity<Vendor> approveVendor(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.approveVendor(id));
    }

    @PostMapping("/vendors/{id}/reject")
    public ResponseEntity<Vendor> rejectVendor(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(adminService.rejectVendor(id, body.get("reason")));
    }

    // ── Recipe Approvals ──────────────────────────────────────────────────────

    @GetMapping("/recipes/pending")
    public ResponseEntity<List<Recipe>> getPendingRecipes() {
        return ResponseEntity.ok(adminService.getPendingRecipes());
    }

    @PostMapping("/recipes/{id}/approve")
    public ResponseEntity<Recipe> approveRecipe(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.approveRecipe(id));
    }

    @PostMapping("/recipes/{id}/reject")
    public ResponseEntity<Recipe> rejectRecipe(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.rejectRecipe(id));
    }
}
