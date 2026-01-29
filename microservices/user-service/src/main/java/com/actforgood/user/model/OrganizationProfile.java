package com.actforgood.user.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationProfile {
    private String organizationName;
    private String registrationNumber;
    private String description;
    private List<String> documents; // URLs to uploaded documents (statutes, reports)
    private String address;
    private String city;
    private String region;
    private List<String> focusAreas; // Education, Health, Orphans, etc.
    private Integer beneficiariesCount;
    private Boolean verified; // Verified by platform
    private LocalDateTime verificationDate;
}
