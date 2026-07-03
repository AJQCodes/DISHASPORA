package com.dishaspora.admin.controller;

import com.dishaspora.admin.dto.FlagDto;
import com.dishaspora.admin.service.AdminService;
import com.dishaspora.admin.service.AnalyticsService;
import com.dishaspora.auth.dto.UserDto;
import com.dishaspora.auth.entity.User;
import com.dishaspora.marketplace.dto.ListingDto;
import com.dishaspora.marketplace.dto.VendorDto;
import com.dishaspora.recipe.dto.RecipeDto;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final AnalyticsService analyticsService;

    public AdminController(AdminService adminService, AnalyticsService analyticsService) {
        this.adminService = adminService;
        this.analyticsService = analyticsService;
    }

    public record FeedbackRequest(String feedback) {}

    // ---- Queues ----

    @GetMapping("/queue/vendors")
    public List<VendorDto> pendingVendors() {
        return adminService.pendingVendors();
    }

    @PostMapping("/vendors/{id}/approve")
    public VendorDto approveVendor(@PathVariable Long id) {
        return adminService.approveVendor(id);
    }

    @PostMapping("/vendors/{id}/reject")
    public VendorDto rejectVendor(@PathVariable Long id, @RequestBody(required = false) FeedbackRequest request) {
        return adminService.rejectVendor(id, request == null ? null : request.feedback());
    }

    @GetMapping("/queue/recipes")
    public List<RecipeDto> pendingRecipes(@AuthenticationPrincipal User admin) {
        return adminService.pendingRecipes(admin);
    }

    @PostMapping("/recipes/{id}/approve")
    public RecipeDto approveRecipe(@PathVariable Long id, @AuthenticationPrincipal User admin) {
        return adminService.approveRecipe(id, admin);
    }

    @PostMapping("/recipes/{id}/reject")
    public RecipeDto rejectRecipe(@PathVariable Long id,
                                  @RequestBody(required = false) FeedbackRequest request,
                                  @AuthenticationPrincipal User admin) {
        return adminService.rejectRecipe(id, request == null ? null : request.feedback(), admin);
    }

    @GetMapping("/queue/listings")
    public List<ListingDto> pendingListings() {
        return adminService.pendingListings();
    }

    @PostMapping("/listings/{id}/approve")
    public ListingDto approveListing(@PathVariable Long id) {
        return adminService.approveListing(id);
    }

    @PostMapping("/listings/{id}/reject")
    public ListingDto rejectListing(@PathVariable Long id,
                                    @RequestBody(required = false) FeedbackRequest request) {
        return adminService.rejectListing(id, request == null ? null : request.feedback());
    }

    // ---- Flags ----

    @GetMapping("/flags")
    public List<FlagDto> flags(@RequestParam(required = false) Boolean resolved) {
        return adminService.flags(resolved);
    }

    @PostMapping("/flags/{id}/resolve")
    public FlagDto resolveFlag(@PathVariable Long id) {
        return adminService.resolveFlag(id);
    }

    // ---- Analytics ----

    @GetMapping("/analytics")
    public Map<String, Object> analytics() {
        return analyticsService.analytics();
    }

    // ---- Users ----

    @GetMapping("/users")
    public List<UserDto> users(@RequestParam(required = false) String q) {
        return adminService.users(q);
    }

    @PostMapping("/users/{id}/ban")
    public UserDto ban(@PathVariable Long id) {
        return adminService.setBanned(id, true);
    }

    @PostMapping("/users/{id}/unban")
    public UserDto unban(@PathVariable Long id) {
        return adminService.setBanned(id, false);
    }
}
