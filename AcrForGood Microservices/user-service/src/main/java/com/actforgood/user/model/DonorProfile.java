package com.actforgood.user.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonorProfile {
    private List<String> preferences; // Education, Health, Orphans, etc.
    private String preferredRegion; // North Cameroon, Yaoundé, etc.
    private Double monthlyBudget;
    private DonationFrequency frequency; // ONCE, MONTHLY, QUARTERLY, YEARLY
    private Integer totalDonations;
    private Double totalAmountDonated;
    
    public enum DonationFrequency {
        ONCE, MONTHLY, QUARTERLY, YEARLY
    }
}
