package com.dishaspora.service;

import com.dishaspora.entity.Recipe;
import com.dishaspora.entity.Vendor;
import com.dishaspora.repository.RecipeRepository;
import com.dishaspora.repository.UserRepository;
import com.dishaspora.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final RecipeRepository recipeRepository;
    private final VendorService vendorService;
    private final RecipeService recipeService;

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers",    userRepository.count());
        stats.put("activeVendors", vendorRepository.findByApprovalStatus(Vendor.ApprovalStatus.approved).size());
        stats.put("totalRecipes",  recipeRepository.findByApprovalStatus(Recipe.ApprovalStatus.APPROVED).size());
        stats.put("pendingVendors", vendorRepository.findByApprovalStatus(Vendor.ApprovalStatus.pending).size());
        stats.put("pendingRecipes", recipeRepository.findByApprovalStatus(Recipe.ApprovalStatus.PENDING).size());
        return stats;
    }

    public List<Vendor> getPendingVendors() {
        return vendorService.getPending();
    }

    public Vendor approveVendor(UUID id) {
        return vendorService.approve(id);
    }

    public Vendor rejectVendor(UUID id, String reason) {
        return vendorService.reject(id, reason);
    }

    public List<Recipe> getPendingRecipes() {
        return recipeService.getPending();
    }

    public Recipe approveRecipe(UUID id) {
        return recipeService.approve(id);
    }

    public Recipe rejectRecipe(UUID id) {
        return recipeService.reject(id);
    }
}
