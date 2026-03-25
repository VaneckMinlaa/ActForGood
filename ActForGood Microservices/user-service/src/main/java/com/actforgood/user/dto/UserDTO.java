package com.actforgood.user.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String userType;
    private String location;
    private String country;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;
    private DonorProfileDTO donorProfile;
    private OrganizationProfileDTO organizationProfile;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DonorProfileDTO implements Serializable {
        private String donorType;
        private java.math.BigDecimal totalDonations;
        private int campaignsSupported;
        private java.util.List<String> preferredCategories;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrganizationProfileDTO implements Serializable {
        private String organizationName;
        private String organizationType;
        private Integer creationYear;
        private String websiteUrl;
        private String address;
        private String mission;
        private java.util.List<String> sectors;
        
        private String rccm;
        private String taxId;
        private String legalDocUrl;
        private String statutesUrl;
        
        private String minasAuthUrl;
        private String assocReceiptUrl;
        private String rulesInternalUrl;
        private String registryEntryUrl;
        private String socialInquiryUrl;

        private java.util.Map<String, String> socializeLinks;
        private String representativeName;
        private String representativeContact;
    }
}
