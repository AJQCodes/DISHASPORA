package com.dishaspora.chat.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "chat_threads", uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "vendorId"}))
public class ChatThread {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long vendorId;

    @Column(length = 2000)
    private String lastMessageBody;

    private Instant lastMessageAt;

    private Instant userLastReadAt;

    private Instant vendorLastReadAt;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }
    public String getLastMessageBody() { return lastMessageBody; }
    public void setLastMessageBody(String lastMessageBody) { this.lastMessageBody = lastMessageBody; }
    public Instant getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(Instant lastMessageAt) { this.lastMessageAt = lastMessageAt; }
    public Instant getUserLastReadAt() { return userLastReadAt; }
    public void setUserLastReadAt(Instant userLastReadAt) { this.userLastReadAt = userLastReadAt; }
    public Instant getVendorLastReadAt() { return vendorLastReadAt; }
    public void setVendorLastReadAt(Instant vendorLastReadAt) { this.vendorLastReadAt = vendorLastReadAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
