package com.actforgood.wallet.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "wallet_transactions", indexes = {
    @Index(name = "idx_tx_wallet_id", columnList = "wallet_id"),
    @Index(name = "idx_tx_type", columnList = "transaction_type"),
    @Index(name = "idx_tx_status", columnList = "status"),
    @Index(name = "idx_tx_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, name = "wallet_id")
    private UUID walletId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "transaction_type")
    private TransactionType transactionType;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(precision = 19, scale = 2)
    private BigDecimal balanceAfter;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status = TransactionStatus.PENDING;

    private String description;
    private String referenceId; // Payment ID, Campaign ID, etc.
    private String recipientId; // For transfers

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Version
    private Long version;

    public enum TransactionType {
        DEPOSIT, WITHDRAWAL, TRANSFER, REFUND
    }

    public enum TransactionStatus {
        PENDING, COMPLETED, FAILED, CANCELLED
    }

    // Helper methods
    public void complete() {
        this.status = TransactionStatus.COMPLETED;
    }

    public void fail() {
        this.status = TransactionStatus.FAILED;
    }

    public boolean isCompleted() {
        return this.status == TransactionStatus.COMPLETED;
    }
}
