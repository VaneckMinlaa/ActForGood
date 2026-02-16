package com.actforgood.campaign.repository;

import com.actforgood.campaign.model.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByOrganizationId(String organizationId);
    List<Campaign> findByStatus(Campaign.CampaignStatus status);
    List<Campaign> findByCategory(String category);
    List<Campaign> findByRegion(String region);
    List<Campaign> findByUrgency(Campaign.UrgencyLevel urgency);
}
