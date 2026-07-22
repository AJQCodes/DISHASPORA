package com.dishaspora.order.entity;

import com.dishaspora.common.enums.Enums.OrderStatus;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String reference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING_PAYMENT;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long vendorId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "order_items", joinColumns = @JoinColumn(name = "order_id"))
    @OrderColumn(name = "item_order")
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false)
    private long subtotalMinor;

    @Column(nullable = false)
    private long feeMinor;

    @Column(nullable = false)
    private long deliveryMinor;

    @Column(nullable = false)
    private long totalMinor;

    @Column(nullable = false)
    private String currency = "GHS";

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
    public long getSubtotalMinor() { return subtotalMinor; }
    public void setSubtotalMinor(long subtotalMinor) { this.subtotalMinor = subtotalMinor; }
    public long getFeeMinor() { return feeMinor; }
    public void setFeeMinor(long feeMinor) { this.feeMinor = feeMinor; }
    public long getDeliveryMinor() { return deliveryMinor; }
    public void setDeliveryMinor(long deliveryMinor) { this.deliveryMinor = deliveryMinor; }
    public long getTotalMinor() { return totalMinor; }
    public void setTotalMinor(long totalMinor) { this.totalMinor = totalMinor; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
