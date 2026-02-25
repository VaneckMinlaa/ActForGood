package com.actforgood.campaign.repository;

import com.actforgood.campaign.model.Campaign;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, UUID> {

    Page<Campaign> findByOrganizationId(UUID organizationId, Pageable pageable);

    List<Campaign> findByOrganizationId(UUID organizationId);

    List<Campaign> findByStatus(Campaign.CampaignStatus status);

    Page<Campaign> findByStatus(Campaign.CampaignStatus status, Pageable pageable);

    List<Campaign> findByCategory(String category);

    Page<Campaign> findByCategory(String category, Pageable pageable);

    List<Campaign> findByRegion(String region);

    List<Campaign> findByUrgency(Campaign.UrgencyLevel urgency);

    @Query("SELECT c FROM Campaign c WHERE c.status = :status AND c.collectedAmount < c.targetAmount")
    List<Campaign> findActiveCampaignsNeedingFunds(@Param("status") Campaign.CampaignStatus status);

    @Query("SELECT c FROM Campaign c WHERE " +
           "LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Campaign> searchByTitleOrDescription(@Param("query") String query, Pageable pageable);
}
