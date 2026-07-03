package com.dishaspora.admin.service;

import com.dishaspora.admin.dto.FlagDto;
import com.dishaspora.admin.entity.Flag;
import com.dishaspora.admin.repository.FlagRepository;
import com.dishaspora.auth.dto.UserDto;
import com.dishaspora.auth.entity.User;
import com.dishaspora.auth.repository.UserRepository;
import com.dishaspora.common.enums.Enums.ApprovalStatus;
import com.dishaspora.common.enums.Enums.Role;
import com.dishaspora.common.exception.NotFoundException;
import com.dishaspora.marketplace.dto.ListingDto;
import com.dishaspora.marketplace.dto.VendorDto;
import com.dishaspora.marketplace.entity.Listing;
import com.dishaspora.marketplace.entity.Vendor;
import com.dishaspora.marketplace.repository.ListingRepository;
import com.dishaspora.marketplace.repository.VendorRepository;
import com.dishaspora.recipe.dto.RecipeDto;
import com.dishaspora.recipe.entity.Recipe;
import com.dishaspora.recipe.repository.RecipeRepository;
import com.dishaspora.recipe.service.RecipeMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final VendorRepository vendorRepository;
    private final RecipeRepository recipeRepository;
    private final ListingRepository listingRepository;
    private final FlagRepository flagRepository;
    private final UserRepository userRepository;
    private final RecipeMapper recipeMapper;

    public AdminService(VendorRepository vendorRepository,
                        RecipeRepository recipeRepository,
                        ListingRepository listingRepository,
                        FlagRepository flagRepository,
                        UserRepository userRepository,
                        RecipeMapper recipeMapper) {
        this.vendorRepository = vendorRepository;
        this.recipeRepository = recipeRepository;
        this.listingRepository = listingRepository;
        this.flagRepository = flagRepository;
        this.userRepository = userRepository;
        this.recipeMapper = recipeMapper;
    }

    // ---- Vendor queue ----

    public List<VendorDto> pendingVendors() {
        return vendorRepository.findByStatus(ApprovalStatus.PENDING).stream()
                .map(VendorDto::from).toList();
    }

    @Transactional
    public VendorDto approveVendor(Long id) {
        Vendor vendor = findVendor(id);
        vendor.setStatus(ApprovalStatus.APPROVED);
        vendor.setRejectionFeedback(null);
        vendor = vendorRepository.save(vendor);
        // Approval flips the owning user's role to VENDOR.
        User owner = userRepository.findById(vendor.getOwnerUserId()).orElse(null);
        if (owner != null && owner.getRole() == Role.USER) {
            owner.setRole(Role.VENDOR);
            userRepository.save(owner);
        }
        return VendorDto.from(vendor);
    }

    @Transactional
    public VendorDto rejectVendor(Long id, String feedback) {
        Vendor vendor = findVendor(id);
        vendor.setStatus(ApprovalStatus.REJECTED);
        vendor.setRejectionFeedback(feedback);
        return VendorDto.from(vendorRepository.save(vendor));
    }

    // ---- Recipe queue ----

    public List<RecipeDto> pendingRecipes(User admin) {
        return recipeMapper.toDtos(recipeRepository.findByStatus(ApprovalStatus.PENDING), admin);
    }

    @Transactional
    public RecipeDto approveRecipe(Long id, User admin) {
        Recipe recipe = findRecipe(id);
        recipe.setStatus(ApprovalStatus.APPROVED);
        recipe.setRejectionFeedback(null);
        return recipeMapper.toDto(recipeRepository.save(recipe), admin);
    }

    @Transactional
    public RecipeDto rejectRecipe(Long id, String feedback, User admin) {
        Recipe recipe = findRecipe(id);
        recipe.setStatus(ApprovalStatus.REJECTED);
        recipe.setRejectionFeedback(feedback);
        return recipeMapper.toDto(recipeRepository.save(recipe), admin);
    }

    // ---- Listing queue ----

    public List<ListingDto> pendingListings() {
        return listingRepository.findByStatus(ApprovalStatus.PENDING).stream()
                .map(l -> ListingDto.from(l, vendorRepository.findById(l.getVendorId()).orElse(null)))
                .toList();
    }

    @Transactional
    public ListingDto approveListing(Long id) {
        Listing listing = findListing(id);
        listing.setStatus(ApprovalStatus.APPROVED);
        listing.setRejectionFeedback(null);
        listing = listingRepository.save(listing);
        return ListingDto.from(listing, vendorRepository.findById(listing.getVendorId()).orElse(null));
    }

    @Transactional
    public ListingDto rejectListing(Long id, String feedback) {
        Listing listing = findListing(id);
        listing.setStatus(ApprovalStatus.REJECTED);
        listing.setRejectionFeedback(feedback);
        listing = listingRepository.save(listing);
        return ListingDto.from(listing, vendorRepository.findById(listing.getVendorId()).orElse(null));
    }

    // ---- Flags ----

    public List<FlagDto> flags(Boolean resolved) {
        List<Flag> flags = resolved == null
                ? flagRepository.findAllByOrderByCreatedAtDesc()
                : flagRepository.findByResolvedOrderByCreatedAtDesc(resolved);
        return flags.stream().map(FlagDto::from).toList();
    }

    @Transactional
    public FlagDto resolveFlag(Long id) {
        Flag flag = flagRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Flag not found"));
        flag.setResolved(true);
        return FlagDto.from(flagRepository.save(flag));
    }

    // ---- Users ----

    public List<UserDto> users(String q) {
        List<User> users = (q == null || q.isBlank())
                ? userRepository.findAll()
                : userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(q, q);
        return users.stream().map(UserDto::from).toList();
    }

    @Transactional
    public UserDto setBanned(Long id, boolean banned) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        user.setBanned(banned);
        return UserDto.from(userRepository.save(user));
    }

    private Vendor findVendor(Long id) {
        return vendorRepository.findById(id).orElseThrow(() -> new NotFoundException("Vendor not found"));
    }

    private Recipe findRecipe(Long id) {
        return recipeRepository.findById(id).orElseThrow(() -> new NotFoundException("Recipe not found"));
    }

    private Listing findListing(Long id) {
        return listingRepository.findById(id).orElseThrow(() -> new NotFoundException("Listing not found"));
    }
}
