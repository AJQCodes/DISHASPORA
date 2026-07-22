package com.dishaspora.order.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class OrderItem {

    @Column(name = "listing_id")
    private Long listingId;

    @Column(name = "item_title")
    private String title;

    @Column(name = "item_image_url")
    private String imageUrl;

    @Column(name = "item_qty")
    private int qty;

    @Column(name = "item_amount_minor")
    private long amountMinor;

    public OrderItem() {}

    public OrderItem(Long listingId, String title, String imageUrl, int qty, long amountMinor) {
        this.listingId = listingId;
        this.title = title;
        this.imageUrl = imageUrl;
        this.qty = qty;
        this.amountMinor = amountMinor;
    }

    public Long getListingId() { return listingId; }
    public void setListingId(Long listingId) { this.listingId = listingId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public int getQty() { return qty; }
    public void setQty(int qty) { this.qty = qty; }
    public long getAmountMinor() { return amountMinor; }
    public void setAmountMinor(long amountMinor) { this.amountMinor = amountMinor; }
}
