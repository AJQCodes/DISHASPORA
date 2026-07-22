package com.dishaspora.config.seed;

import com.dishaspora.auth.entity.User;
import com.dishaspora.admin.entity.Flag;
import com.dishaspora.chat.entity.ChatMessage;
import com.dishaspora.chat.entity.ChatThread;
import com.dishaspora.common.enums.Enums.FlagTargetType;
import com.dishaspora.common.enums.Enums.FlagType;
import com.dishaspora.common.enums.Enums.OrderStatus;
import com.dishaspora.marketplace.entity.Listing;
import com.dishaspora.marketplace.entity.Vendor;
import com.dishaspora.marketplace.entity.VendorReview;
import com.dishaspora.order.entity.Order;
import com.dishaspora.order.entity.OrderItem;
import com.dishaspora.recipe.entity.CookedRecipe;
import com.dishaspora.recipe.entity.Recipe;
import com.dishaspora.recipe.entity.RecipeReview;
import com.dishaspora.recipe.entity.SavedRecipe;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

/** Seeds reviews, flags, orders, saved/cooked recipes and a chat thread. */
@Component
public class MiscSeeder {

    private final SeedSupport s;

    public MiscSeeder(SeedSupport s) {
        this.s = s;
    }

    public void seedReviews(User ama, User chinedu) {
        recipeReview("Jollof Rice", ama, 5, "Tastes exactly like my grandma's party jollof. The smoky flavour is spot on!");
        recipeReview("Jollof Rice", chinedu, 4, "Very good... but Naija jollof still wins. Great recipe though!");
        recipeReview("Nigerian Jollof Rice", chinedu, 5, "THIS is jollof. The firewood tip changed everything.");
        recipeReview("Nigerian Jollof Rice", ama, 4, "Delicious, I admit. The rivalry continues.");
        recipeReview("Egusi Soup & Pounded Yam", ama, 5, "My first egusi ever and it came out perfect. Clear steps!");
        recipeReview("Banku & Tilapia", chinedu, 5, "The pepper sauce recipe alone is worth it.");
        recipeReview("Suya", ama, 5, "Made this for friends - gone in minutes.");
        recipeReview("Sobolo", chinedu, 4, "Refreshing and not too sweet. Adding more ginger next time.");

        vendorReview(vendorReviewTarget("GH"), ama, 5, "Fast delivery and the jollof was still hot. Highly recommend!");
        vendorReview(vendorReviewTarget("GH"), chinedu, 4, "Great packaging, generous portions.");
        vendorReview(vendorReviewTarget("NG"), chinedu, 5, "Best suya in Lagos, no debate.");
        vendorReview(vendorReviewTarget("NG"), ama, 4, "Ordered for a friend in Lagos - she loved it.");
    }

    public void seedFlags(Long pendingRecipeId, String pendingRecipeTitle,
                          Long pendingListingId, String pendingListingTitle,
                          Long pendingVendorId, String pendingVendorName) {
        s.flags.save(new Flag(FlagType.DUPLICATE_RECIPE, FlagTargetType.RECIPE,
                pendingRecipeId, pendingRecipeTitle,
                "A recipe with a very similar title (Kenkey & Pepper Sauce) already exists."));
        s.flags.save(new Flag(FlagType.CATEGORY_SUSPECT, FlagTargetType.RECIPE,
                pendingRecipeId, pendingRecipeTitle,
                "Automatic category check requested a manual review."));
        s.flags.save(new Flag(FlagType.REPEATED_SUBMISSION, FlagTargetType.LISTING,
                pendingListingId, pendingListingTitle,
                "Vendor submitted 3 items within the last 10 minutes."));
        s.flags.save(new Flag(FlagType.INAPPROPRIATE, FlagTargetType.VENDOR,
                pendingVendorId, pendingVendorName,
                "Vendor bio contained a word from the review list; please verify manually."));
        Flag resolved = new Flag(FlagType.COUNTRY_MISMATCH, FlagTargetType.LISTING,
                pendingListingId, pendingListingTitle,
                "Listing country differed from vendor country at submission time.");
        resolved.setResolved(true);
        s.flags.save(resolved);
    }

    public void seedOrders(User ama, User chinedu) {
        Listing ghFood1 = listingByTitle("Jollof Rice with Grilled Chicken");
        Listing ghFood2 = listingByTitle("Kelewele Night Pack");
        if (ghFood1 != null && ghFood2 != null) {
            order(ama, OrderStatus.PAID, "GHS",
                    List.of(ghFood1, ghFood2), List.of(2, 1), 2);
        }
        Listing ngFood1 = listingByTitle("Suya Skewers (6 sticks)");
        if (ngFood1 != null) {
            order(chinedu, OrderStatus.COMPLETED, "NGN",
                    List.of(ngFood1), List.of(1), 5);
        }
        Listing ghFood3 = listingByTitle("Waakye Special Combo");
        if (ghFood3 != null) {
            order(ama, OrderStatus.PENDING_PAYMENT, "GHS",
                    List.of(ghFood3), List.of(1), 0);
        }
    }

    public void seedChat(User ama, Vendor ghVendor, User ghVendorOwner) {
        ChatThread thread = new ChatThread();
        thread.setUserId(ama.getId());
        thread.setVendorId(ghVendor.getId());
        thread = s.chatThreads.save(thread);

        Instant base = Instant.now().minus(2, ChronoUnit.HOURS);
        message(thread, ama, "Hi! Is the banku & tilapia combo available today?", base);
        message(thread, ghVendorOwner, "Hello Ama! Yes it is - fresh tilapia came in this morning.", base.plusSeconds(300));
        ChatMessage last = message(thread, ama, "Perfect, I'll order for 7pm. Can you add extra pepper sauce?", base.plusSeconds(900));

        thread.setLastMessageBody(last.getBody());
        thread.setLastMessageAt(last.getCreatedAt());
        thread.setUserLastReadAt(last.getCreatedAt());
        s.chatThreads.save(thread);
    }

    public void seedSavedAndCooked(User ama, User chinedu) {
        saveRecipe(ama, "Nigerian Jollof Rice");
        saveRecipe(ama, "Kelewele");
        saveRecipe(ama, "Chicken Shawarma");
        saveRecipe(chinedu, "Jollof Rice");
        saveRecipe(chinedu, "Egusi Soup & Pounded Yam");

        cook(ama, "Jollof Rice");
        cook(ama, "Red Red");
        cook(ama, "Nigerian Jollof Rice");
        cook(chinedu, "Suya");
    }

    // ---- helpers ----

    private void recipeReview(String recipeTitle, User author, int rating, String comment) {
        Long id = s.recipeIdByTitle(recipeTitle);
        if (id == null) return;
        RecipeReview review = new RecipeReview();
        review.setRecipeId(id);
        review.setUserId(author.getId());
        review.setRating(rating);
        review.setComment(comment);
        s.recipeReviews.save(review);
    }

    private Vendor vendorReviewTarget(String country) {
        return s.vendors.findAll().stream()
                .filter(v -> v.getCountry().equals(country))
                .findFirst()
                .orElse(null);
    }

    private void vendorReview(Vendor vendor, User author, int rating, String comment) {
        if (vendor == null) return;
        VendorReview review = new VendorReview();
        review.setVendorId(vendor.getId());
        review.setUserId(author.getId());
        review.setRating(rating);
        review.setComment(comment);
        s.vendorReviews.save(review);
    }

    private Listing listingByTitle(String title) {
        return s.listings.findAll().stream()
                .filter(l -> l.getTitle().equalsIgnoreCase(title))
                .findFirst()
                .orElse(null);
    }

    private void order(User user, OrderStatus status, String currency,
                       List<Listing> items, List<Integer> qtys, int daysAgo) {
        Order order = new Order();
        long subtotal = 0;
        for (int i = 0; i < items.size(); i++) {
            Listing l = items.get(i);
            int qty = qtys.get(i);
            subtotal += l.getAmountMinor() * qty;
            order.getItems().add(new OrderItem(l.getId(), l.getTitle(), l.getImageUrl(),
                    qty, l.getAmountMinor()));
        }
        long fee = Math.round(subtotal * 0.07);
        order.setReference("DSP-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase());
        order.setStatus(status);
        order.setUserId(user.getId());
        order.setVendorId(items.get(0).getVendorId());
        order.setSubtotalMinor(subtotal);
        order.setFeeMinor(fee);
        order.setDeliveryMinor(300);
        order.setTotalMinor(subtotal + fee + 300);
        order.setCurrency(currency);
        order.setCreatedAt(Instant.now().minus(daysAgo, ChronoUnit.DAYS));
        s.orders.save(order);
    }

    private ChatMessage message(ChatThread thread, User sender, String body, Instant at) {
        ChatMessage m = new ChatMessage();
        m.setThreadId(thread.getId());
        m.setSenderId(sender.getId());
        m.setBody(body);
        m.setCreatedAt(at);
        return s.chatMessages.save(m);
    }

    private void saveRecipe(User user, String title) {
        Long id = s.recipeIdByTitle(title);
        if (id != null) {
            s.saved.save(new SavedRecipe(user.getId(), id));
        }
    }

    private void cook(User user, String title) {
        Recipe recipe = s.recipes.findAll().stream()
                .filter(r -> r.getTitle().equalsIgnoreCase(title))
                .findFirst()
                .orElse(null);
        if (recipe != null) {
            s.cooked.save(new CookedRecipe(user.getId(), recipe.getId(), recipe.getCountryOfOrigin()));
        }
    }
}
