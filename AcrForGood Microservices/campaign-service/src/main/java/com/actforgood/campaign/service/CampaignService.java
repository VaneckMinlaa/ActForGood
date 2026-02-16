package com.actforgood.campaign.service;

import com.actforgood.campaign.model.Campaign;
import com.actforgood.campaign.repository.CampaignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CampaignService {
    
    @Autowired
    private CampaignRepository campaignRepository;
    
    public Campaign createCampaign(Campaign campaign) {
        campaign.setId(null);
        campaign.setStatus(Campaign.CampaignStatus.DRAFT);
        campaign.setCurrentAmount(0.0);
        campaign.setDonorCount(0);
        campaign.setCreatedAt(LocalDateTime.now());
        campaign.setUpdatedAt(LocalDateTime.now());
        return campaignRepository.save(campaign);
    }

    public Campaign updateCampaign(String id, Campaign campaign) {
        Long pk = parseId(id);
        Campaign existing = campaignRepository.findById(pk)
            .orElseThrow(() -> new RuntimeException("Campaign not found"));
        existing.setTitle(campaign.getTitle());
        existing.setDescription(campaign.getDescription());
        existing.setCategory(campaign.getCategory());
        existing.setLocation(campaign.getLocation());
        existing.setRegion(campaign.getRegion());
        existing.setTargetAmount(campaign.getTargetAmount());
        existing.setUrgency(campaign.getUrgency());
        existing.setUpdatedAt(LocalDateTime.now());
        return campaignRepository.save(existing);
    }

    public Campaign getCampaignById(String id) {
        Long pk = parseId(id);
        return campaignRepository.findById(pk)
            .orElseThrow(() -> new RuntimeException("Campaign not found"));
    }

    private static Long parseId(String id) {
        try {
            return Long.parseLong(id);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Campaign not found");
        }
    }
    
    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }
    
    public List<Campaign> getCampaignsByOrganization(String organizationId) {
        return campaignRepository.findByOrganizationId(organizationId);
    }
    
    public List<Campaign> getActiveCampaigns() {
        return campaignRepository.findByStatus(Campaign.CampaignStatus.ACTIVE);
    }
    
    public Campaign activateCampaign(String id) {
        Campaign campaign = getCampaignById(id);
        campaign.setStatus(Campaign.CampaignStatus.ACTIVE);
        campaign.setStartDate(LocalDateTime.now());
        campaign.setUpdatedAt(LocalDateTime.now());
        return campaignRepository.save(campaign);
    }

    public void updateCampaignAmount(String id, Double amount) {
        Campaign campaign = getCampaignById(id);
        campaign.setCurrentAmount(campaign.getCurrentAmount() + amount);
        campaign.setDonorCount(campaign.getDonorCount() + 1);
        campaign.setUpdatedAt(LocalDateTime.now());
        campaignRepository.save(campaign);
    }
}
