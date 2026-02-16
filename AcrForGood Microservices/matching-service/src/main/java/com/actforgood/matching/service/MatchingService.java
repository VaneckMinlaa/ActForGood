package com.actforgood.matching.service;

import com.actforgood.matching.client.CampaignClient;
import com.actforgood.matching.client.UserClient;
import com.actforgood.matching.model.MatchFactors;
import com.actforgood.matching.model.MatchScore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MatchingService {
    
    @Autowired
    private CampaignClient campaignClient;
    
    @Autowired
    private UserClient userClient;
    
    @Autowired
    private RecommendationAlgorithm recommendationAlgorithm;
    
    public List<MatchScore> getRecommendations(String donorId, Integer limit) {
        // Fetch donor profile
        Object donor = userClient.getUser(donorId);
        if (donor == null) {
            return new ArrayList<>();
        }
        try {
            Object profile = donor.getClass().getMethod("getDonorProfile").invoke(donor);
            if (profile == null) {
                return new ArrayList<>();
            }
        } catch (Exception e) {
            return new ArrayList<>();
        }
        
        // Fetch all active campaigns
        var campaigns = campaignClient.getActiveCampaigns();
        
        // Calculate match scores
        List<MatchScore> matches = campaigns.stream()
            .map(campaign -> calculateMatchScore(donor, campaign))
            .sorted(Comparator.comparing(MatchScore::getScore).reversed())
            .limit(limit != null ? limit : 10)
            .collect(Collectors.toList());
        
        return matches;
    }
    
    private MatchScore calculateMatchScore(Object donor, Object campaign) {
        // Use recommendation algorithm to calculate scores
        MatchFactors factors = recommendationAlgorithm.calculateFactors(donor, campaign);
        Double totalScore = recommendationAlgorithm.calculateTotalScore(factors);
        String reason = recommendationAlgorithm.generateReason(factors);
        
        MatchScore match = new MatchScore();
        match.setCampaignId(getCampaignId(campaign));
        match.setCampaignTitle(getCampaignTitle(campaign));
        match.setScore(totalScore);
        match.setReason(reason);
        match.setFactors(factors);
        
        return match;
    }
    
    @SuppressWarnings("unchecked")
    private String getCampaignId(Object campaign) {
        if (campaign instanceof Map) {
            Object id = ((Map<String, Object>) campaign).get("id");
            return id != null ? id.toString() : "";
        }
        try {
            Object id = campaign.getClass().getMethod("getId").invoke(campaign);
            return id != null ? id.toString() : "";
        } catch (Exception e) {
            return "";
        }
    }

    @SuppressWarnings("unchecked")
    private String getCampaignTitle(Object campaign) {
        if (campaign instanceof Map) {
            Object title = ((Map<String, Object>) campaign).get("title");
            return title != null ? title.toString() : "";
        }
        try {
            Object title = campaign.getClass().getMethod("getTitle").invoke(campaign);
            return title != null ? title.toString() : "";
        } catch (Exception e) {
            return "";
        }
    }
}
