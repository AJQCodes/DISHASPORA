package com.dishaspora.marketplace.entity;

import com.dishaspora.common.enums.Enums.ApprovalStatus;
import com.dishaspora.common.enums.Enums.ListingType;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "listings")
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingType type = ListingType.FOOD;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private String imageUrl;

    @Column(nullable = false)
    private long amountMinor;

    @Column(nullable = false)
    private String currency = "GHS";

    private Long compareAtMinor;

    @Column(nullable = false)
    private String country = "GH";

    private boolean available = true;

    private int stockQty;

    private String quantity;

    private String unit;

    private Integer prepMinutes;

    @Column(nullable = false)
    private Long vendorId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalStatus status = ApprovalStatus.PENDING;

    private String rejectionFeedback;

    private Long linkedRecipeId;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ListingType getType() { return type; }
    public void setType(ListingType type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public long getAmountMinor() { return amountMinor; }
    public void setAmountMinor(long amountMinor) { this.amountMinor = amountMinor; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public Long getCompareAtMinor() { return compareAtMinor; }
    public void setCompareAtMinor(Long compareAtMinor) { this.compareAtMinor = compareAtMinor; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public int getStockQty() { return stockQty; }
    public void setStockQty(int stockQty) { this.stockQty = stockQty; }
    public String getQuantity() { return quantity; }
    public void setQuantity(String quantity) { this.quantity = quantity; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public Integer getPrepMinutes() { return prepMinutes; }
    public void setPrepMinutes(Integer prepMinutes) { this.prepMinutes = prepMinutes; }
    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }
    public ApprovalStatus getStatus() { return status; }
    public void setStatus(ApprovalStatus status) { this.status = status; }
    public String getRejectionFeedback() { return rejectionFeedback; }
    public void setRejectionFeedback(String rejectionFeedback) { this.rejectionFeedback = rejectionFeedback; }
    public Long getLinkedRecipeId() { return linkedRecipeId; }
    public void setLinkedRecipeId(Long linkedRecipeId) { this.linkedRecipeId = linkedRecipeId; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
