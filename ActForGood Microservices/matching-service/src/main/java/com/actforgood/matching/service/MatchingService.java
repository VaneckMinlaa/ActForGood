package com.actforgood.matching.service;

import com.actforgood.matching.client.CampaignClient;
import com.actforgood.matching.client.UserClient;
import com.actforgood.matching.dto.MatchScoreDTO;
import com.actforgood.matching.exception.ResourceNotFoundException;
import com.actforgood.matching.model.MatchFactors;
import com.actforgood.matching.model.MatchScore;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Matching Service - Fourniture de recommandations personnalisées basées sur les préférences du donateur
 * Utilise un algorithme de machine learning pour calculer les scores d'appariement
 */
@Service
@Transactional(readOnly = true)
@Slf4j
public class MatchingService {

    private static final int DEFAULT_LIMIT = 10;
    private static final int MAX_LIMIT = 100;

    @Autowired
    private CampaignClient campaignClient;

    @Autowired
    private UserClient userClient;

    @Autowired
    private RecommendationAlgorithm recommendationAlgorithm;

    /**
     * Obtient les recommandations personnalisées pour un donateur
     */
    public List<MatchScoreDTO> getRecommendations(String donorId, Integer limit) {
        log.info("Getting recommendations for donor: {} with limit: {}", donorId, limit);

        // Validate limit
        if (limit == null || limit <= 0) {
            limit = DEFAULT_LIMIT;
        } else if (limit > MAX_LIMIT) {
            limit = MAX_LIMIT;
        }

        // Fetch donor profile
        Object donor = userClient.getUser(donorId);
        if (donor == null) {
            log.warn("Donor not found: {}", donorId);
            throw new ResourceNotFoundException("Donor", donorId);
        }

        // Verify donor has a profile
        Object profile = extractDonorProfile(donor);
        if (profile == null) {
            log.warn("Donor {} has no profile", donorId);
            return new ArrayList<>();
        }

        log.debug("Donor profile found for: {}", donorId);

        // Fetch all active campaigns
        List<Object> campaigns = campaignClient.getActiveCampaigns();
        if (campaigns == null || campaigns.isEmpty()) {
            log.warn("No active campaigns found");
            return new ArrayList<>();
        }

        log.debug("Found {} active campaigns", campaigns.size());

        // Calculate match scores
        List<MatchScoreDTO> matches = campaigns.stream()
            .map(campaign -> calculateMatchScore(donor, campaign))
            .sorted(Comparator.comparing(MatchScoreDTO::getScore).reversed())
            .limit(limit)
            .collect(Collectors.toList());

        log.info("Generated {} recommendations for donor: {}", matches.size(), donorId);

        return matches;
    }

    /**
     * Calcule un score d'appariement pour une campagne donnée
     */
    private MatchScoreDTO calculateMatchScore(Object donor, Object campaign) {
        try {
            // Use recommendation algorithm to calculate scores
            MatchFactors factors = recommendationAlgorithm.calculateFactors(donor, campaign);
            Double totalScore = recommendationAlgorithm.calculateTotalScore(factors);
            String reason = recommendationAlgorithm.generateReason(factors);

            String campaignId = extractCampaignId(campaign);

            log.debug("Calculated match score {} for campaign: {}", totalScore, campaignId);

            return MatchScoreDTO.builder()
                    .campaignId(campaignId)
                    .campaignTitle(extractCampaignTitle(campaign))
                    .score(totalScore)
                    .reason(reason)
                    .factors(factors)
                    .build();
        } catch (Exception e) {
            log.error("Error calculating match score: ", e);
            // Return with 0 score on error
            return MatchScoreDTO.builder()
                    .score(0.0)
                    .reason("Error calculating score")
                    .build();
        }
    }

    /**
     * Extrait le profil donateur d'un objet utilisateur
     */
    @SuppressWarnings("unchecked")
    private Object extractDonorProfile(Object donor) {
        if (donor instanceof Map) {
            return ((Map<String, Object>) donor).get("donorProfile");
        }
        try {
            return donor.getClass().getMethod("getDonorProfile").invoke(donor);
        } catch (Exception e) {
            log.debug("Unable to extract donor profile: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Extrait l'ID de campagne d'un objet campagne
     */
    @SuppressWarnings("unchecked")
    private String extractCampaignId(Object campaign) {
        if (campaign instanceof Map) {
            Object id = ((Map<String, Object>) campaign).get("id");
            return id != null ? id.toString() : "unknown";
        }
        try {
            Object id = campaign.getClass().getMethod("getId").invoke(campaign);
            return id != null ? id.toString() : "unknown";
        } catch (Exception e) {
            log.debug("Unable to extract campaign ID: {}", e.getMessage());
            return "unknown";
        }
    }

    /**
     * Extrait le titre de campagne d'un objet campagne
     */
    @SuppressWarnings("unchecked")
    private String extractCampaignTitle(Object campaign) {
        if (campaign instanceof Map) {
            Object title = ((Map<String, Object>) campaign).get("title");
            return title != null ? title.toString() : "Unknown Campaign";
        }
        try {
            Object title = campaign.getClass().getMethod("getTitle").invoke(campaign);
            return title != null ? title.toString() : "Unknown Campaign";
        } catch (Exception e) {
            log.debug("Unable to extract campaign title: {}", e.getMessage());
            return "Unknown Campaign";
        }
    }
}
