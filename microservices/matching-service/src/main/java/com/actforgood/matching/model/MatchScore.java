package com.actforgood.matching.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchScore {
    private String campaignId;
    private String campaignTitle;
    private Double score; // 0.0 to 1.0
    private String reason; // Explanation of the match
    private MatchFactors factors;
}
