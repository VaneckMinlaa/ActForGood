package com.actforgood.matching.service;

import com.actforgood.matching.model.MatchFactors;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class RecommendationAlgorithm {
    
    public MatchFactors calculateFactors(Object donor, Object campaign) {
        // Simplified matching algorithm
        // In production, this would use ML models (scikit-learn style)
        
        Double preferenceMatch = calculatePreferenceMatch(donor, campaign);
        Double locationMatch = calculateLocationMatch(donor, campaign);
        Double urgencyScore = calculateUrgencyScore(campaign);
        Double impactScore = calculateImpactScore(campaign);
        Double budgetMatch = calculateBudgetMatch(donor, campaign);
        
        return new MatchFactors(preferenceMatch, locationMatch, urgencyScore, impactScore, budgetMatch);
    }
    
    public Double calculateTotalScore(MatchFactors factors) {
        // Weighted scoring
        return (factors.getPreferenceMatch() * 0.3) +
               (factors.getLocationMatch() * 0.2) +
               (factors.getUrgencyScore() * 0.2) +
               (factors.getImpactScore() * 0.2) +
               (factors.getBudgetMatch() * 0.1);
    }
    
    public String generateReason(MatchFactors factors) {
        StringBuilder reason = new StringBuilder();
        if (factors.getPreferenceMatch() > 0.7) {
            reason.append("Correspond à vos préférences. ");
        }
        if (factors.getUrgencyScore() > 0.7) {
            reason.append("Besoin urgent. ");
        }
        if (factors.getImpactScore() > 0.7) {
            reason.append("Impact élevé. ");
        }
        return reason.toString().trim();
    }
    
    private Double calculatePreferenceMatch(Object donor, Object campaign) {
        // Match donor preferences with campaign category
        // Simplified implementation
        return 0.8; // Placeholder
    }
    
    private Double calculateLocationMatch(Object donor, Object campaign) {
        // Match geographic location
        return 0.7; // Placeholder
    }
    
    @SuppressWarnings("unchecked")
    private Double calculateUrgencyScore(Object campaign) {
        String urgencyStr = null;
        if (campaign instanceof Map) {
            Object u = ((Map<String, Object>) campaign).get("urgency");
            urgencyStr = u != null ? u.toString() : null;
        } else {
            try {
                Object urgency = campaign.getClass().getMethod("getUrgency").invoke(campaign);
                urgencyStr = urgency != null ? urgency.toString() : null;
            } catch (Exception e) {
                // ignore
            }
        }
        if (urgencyStr != null) {
            switch (urgencyStr) {
                case "CRITICAL": return 1.0;
                case "HIGH": return 0.8;
                case "MEDIUM": return 0.5;
                default: return 0.3;
            }
        }
        return 0.5;
    }
    
    private Double calculateImpactScore(Object campaign) {
        // Calculate based on potential beneficiaries
        return 0.75; // Placeholder
    }
    
    private Double calculateBudgetMatch(Object donor, Object campaign) {
        // Match donor budget with campaign needs
        return 0.6; // Placeholder
    }
}
