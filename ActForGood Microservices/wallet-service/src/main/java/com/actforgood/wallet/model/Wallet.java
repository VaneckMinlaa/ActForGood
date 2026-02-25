package com.actforgood.wallet.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "wallets", indexes = {
    @Index(name = "idx_wallet_user_id", columnList = "user_id", unique = true),
    @Index(name = "idx_wallet_status", columnList = "status"),
    @Index(name = "idx_wallet_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, name = "user_id")
    private UUID userId;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal totalDonated = BigDecimal.ZERO;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal totalReceived = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WalletStatus status = WalletStatus.ACTIVE;

    private String currency = "XOF"; // Default currency

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    @Version
    private Long version;

    public enum WalletStatus {
        ACTIVE, FROZEN, CLOSED
    }

    // Helper methods
    public boolean isActive() {
        return this.status == WalletStatus.ACTIVE;
    }

    public void addBalance(BigDecimal amount) {
        this.balance = this.balance.add(amount);
        this.totalDonated = this.totalDonated.add(amount);
    }

    public void deductBalance(BigDecimal amount) {
        this.balance = this.balance.subtract(amount);
        this.totalReceived = this.totalReceived.add(amount);
    }

    public void freeze() {
        this.status = WalletStatus.FROZEN;
    }

    public void activate() {
        this.status = WalletStatus.ACTIVE;
    }

    public void close() {
        this.status = WalletStatus.CLOSED;
    }
}
