package com.actforgood.user.model;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;

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
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_email", columnList = "email", unique = true),
        @Index(name = "idx_user_status", columnList = "status"),
        @Index(name = "idx_user_type", columnList = "user_type"),
        @Index(name = "idx_user_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true) // null until admin validates and sends password by email
    @JsonIgnore
    private String password;

    @Column(nullable = false)
    private String firstName;

    private String lastName;
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "user_type")
    private UserType userType;

    private String location;
    private String country;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.PENDING_VALIDATION;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    @Version
    private Long version;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private DonorProfile donorProfile;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private OrganizationProfile organizationProfile;

    public enum UserType {
        DONOR, NGO, ORPHANAGE, PARTNER;

        @JsonCreator
        public static UserType fromString(String value) {
            if (value == null || value.isEmpty())
                return null;
            if ("ONG".equalsIgnoreCase(value))
                return NGO;
            return UserType.valueOf(value.toUpperCase());
        }
    }

    public enum UserStatus {
        PENDING_VALIDATION, ACTIVE, INACTIVE, SUSPENDED
    }

    // Helper methods
    public boolean isActive() {
        return this.status == UserStatus.ACTIVE;
    }

    public boolean isPendingValidation() {
        return this.status == UserStatus.PENDING_VALIDATION;
    }

    public void activate() {
        this.status = UserStatus.ACTIVE;
    }

    public void suspend() {
        this.status = UserStatus.SUSPENDED;
    }

    public void deactivate() {
        this.status = UserStatus.INACTIVE;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DonorProfile {
        private String donorType;
        private java.math.BigDecimal totalDonations = java.math.BigDecimal.ZERO;
        private int campaignsSupported = 0;
        private java.util.List<String> preferredCategories;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrganizationProfile {
        private String registrationNumber;
        private String organisationType;
        private String websiteUrl;
        private java.util.Map<String, String> socializeLinks;
        private String representativeName;
        private String representativeContact;
    }
}
