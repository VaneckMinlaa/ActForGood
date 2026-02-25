package com.actforgood.blockchain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "blockchain_transactions", indexes = {
    @Index(name = "idx_tx_hash", columnList = "hash", unique = true),
    @Index(name = "idx_tx_status", columnList = "status"),
    @Index(name = "idx_tx_payment_id", columnList = "payment_id"),
    @Index(name = "idx_tx_donor_id", columnList = "donor_id"),
    @Index(name = "idx_tx_campaign_id", columnList = "campaign_id"),
    @Index(name = "idx_tx_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlockchainTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, name = "payment_id")
    private UUID paymentId;

    @Column(nullable = false, name = "donor_id")
    private UUID donorId;

    @Column(nullable = false, name = "campaign_id")
    private UUID campaignId;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, unique = true, length = 256)
    private String hash;

    @Column(length = 256)
    private String previousHash;

    @CreationTimestamp
    @Column(nullable = false, updatable = false, name = "created_at")
    private Instant createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status = TransactionStatus.PENDING;

    @Version
    private Long version;

    public enum TransactionStatus {
        PENDING, CONFIRMED, FAILED
    }

    // Helper methods
    public boolean isConfirmed() {
        return this.status == TransactionStatus.CONFIRMED;
    }

    public boolean isPending() {
        return this.status == TransactionStatus.PENDING;
    }

    public boolean isFailed() {
        return this.status == TransactionStatus.FAILED;
    }

    public void confirm() {
        this.status = TransactionStatus.CONFIRMED;
    }

    public void fail() {
        this.status = TransactionStatus.FAILED;
    }
}
