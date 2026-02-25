package com.actforgood.campaign.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "campaigns", indexes = {
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "created_at"),
    @Index(name = "idx_organization_id", columnList = "organization_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private java.util.UUID id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal targetAmount;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal collectedAmount = BigDecimal.ZERO;

    @Column(name = "organization_id", nullable = false)
    private java.util.UUID organizationId;

    private String category;
    private String location;
    private String region;

    @Column(name = "donor_count")
    private Integer donorCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CampaignStatus status;

    @Enumerated(EnumType.STRING)
    private UrgencyLevel urgency;

    @Column(name = "starts_at")
    private LocalDateTime startDate;

    @Column(name = "ends_at")
    private LocalDateTime endDate;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> images;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> documents;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private ImpactMetrics impactMetrics;

    @Version
    @Column(name = "version")
    private Long version;

    public enum CampaignStatus {
        PENDING,      // Awaiting approval
        ACTIVE,       // Currently accepting donations
        COMPLETED,    // Target reached
        CANCELLED,    // Campaign cancelled
        CLOSED        // No longer accepting donations
    }

    public enum UrgencyLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public BigDecimal getProgressPercentage() {
        if (targetAmount == null || targetAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        return collectedAmount.divide(targetAmount, 2, java.math.RoundingMode.HALF_UP)
            .multiply(new BigDecimal("100"));
    }

    public boolean isActive() {
        return status == CampaignStatus.ACTIVE;
    }

    public boolean isCompleted() {
        return status == CampaignStatus.COMPLETED ||
               (collectedAmount != null && targetAmount != null &&
                collectedAmount.compareTo(targetAmount) >= 0);
    }
}
