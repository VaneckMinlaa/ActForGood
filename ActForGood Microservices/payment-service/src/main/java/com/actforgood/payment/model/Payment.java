package com.actforgood.payment.model;

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
@Table(name = "payments", indexes = {
    @Index(name = "idx_payment_status", columnList = "status"),
    @Index(name = "idx_payment_donor_id", columnList = "donor_id"),
    @Index(name = "idx_payment_campaign_id", columnList = "campaign_id"),
    @Index(name = "idx_payment_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, name = "donor_id")
    private UUID donorId;

    @Column(nullable = false, name = "campaign_id")
    private UUID campaignId;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentProvider provider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(unique = true)
    private String transactionId;

    @Column(unique = true)
    private String blockchainHash;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    @Version
    private Long version;

    public enum PaymentMethod {
        MOBILE_MONEY, CRYPTO, CARD
    }

    public enum PaymentProvider {
        ORANGE_MONEY, MTN_MOMO, STRIPE, PAYPAL, BITCOIN, ETHEREUM
    }

    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED
    }

    // Helper methods
    public boolean isCompleted() {
        return this.status == PaymentStatus.COMPLETED;
    }

    public boolean isFailed() {
        return this.status == PaymentStatus.FAILED;
    }

    public boolean isPending() {
        return this.status == PaymentStatus.PENDING;
    }

    public void complete() {
        this.status = PaymentStatus.COMPLETED;
    }

    public void fail() {
        this.status = PaymentStatus.FAILED;
    }

    public void refund() {
        this.status = PaymentStatus.REFUNDED;
    }
}
