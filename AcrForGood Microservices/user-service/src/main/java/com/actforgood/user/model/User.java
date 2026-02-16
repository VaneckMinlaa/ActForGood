package com.actforgood.user.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true) // null until admin validates and sends password by email
    @JsonIgnore
    private String password;

    private String firstName;
    private String lastName;
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType userType;

    private String location;
    private String country;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.PENDING_VALIDATION;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

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
            if (value == null || value.isEmpty()) return null;
            if ("ONG".equalsIgnoreCase(value)) return NGO;
            return UserType.valueOf(value.toUpperCase());
        }
    }

    public enum UserStatus {
        PENDING_VALIDATION, ACTIVE, INACTIVE, SUSPENDED
    }
}
