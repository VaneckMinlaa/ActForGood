package com.actforgood.campaign.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.actforgood.campaign.dto.CampaignDTO;
import com.actforgood.campaign.dto.CreateCampaignRequest;
import com.actforgood.campaign.exception.ResourceNotFoundException;
import com.actforgood.campaign.exception.ValidationException;
import com.actforgood.campaign.model.Campaign;
import com.actforgood.campaign.repository.CampaignRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class CampaignService {

    @Autowired
    private CampaignRepository campaignRepository;

    public CampaignDTO createCampaign(CreateCampaignRequest request) {
        log.info("Creating campaign: {} for organization: {}", request.getTitle(), request.getOrganizationId());

        validateCreateRequest(request);

        Campaign campaign = Campaign.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .targetAmount(request.getTargetAmount())
                .collectedAmount(BigDecimal.ZERO)
                .status(Campaign.CampaignStatus.PENDING)
                .organizationId(request.getOrganizationId())
                .category(request.getCategory())
                .images(request.getImageUrl() != null ? java.util.List.of(request.getImageUrl()) : null)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .donorCount(0)
                .build();

        campaign = campaignRepository.save(campaign);
        log.info("Campaign created successfully with id: {}", campaign.getId());

        return convertToDTO(campaign);
    }

    public CampaignDTO updateCampaign(UUID id, CreateCampaignRequest request) {
        log.info("Updating campaign: {}", id);

        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign", id));

        campaign.setTitle(request.getTitle());
        campaign.setDescription(request.getDescription());
        campaign.setTargetAmount(request.getTargetAmount());
        campaign.setCategory(request.getCategory());
        campaign.setImages(request.getImageUrl() != null ? java.util.List.of(request.getImageUrl()) : null);
        campaign.setStartDate(request.getStartDate());
        campaign.setEndDate(request.getEndDate());
        campaign.setUpdatedAt(LocalDateTime.now());

        campaign = campaignRepository.save(campaign);
        log.info("Campaign updated successfully: {}", id);

        return convertToDTO(campaign);
    }

    @Transactional(readOnly = true)
    public CampaignDTO getCampaignById(UUID id) {
        log.debug("Fetching campaign by id: {}", id);

        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign", id));

        return convertToDTO(campaign);
    }

    @Transactional(readOnly = true)
    public Page<CampaignDTO> getAllCampaigns(Pageable pageable) {
        log.debug("Fetching all campaigns with pagination");

        return campaignRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public Page<CampaignDTO> getCampaignsByOrganization(UUID organizationId, Pageable pageable) {
        log.debug("Fetching campaigns for organization: {}", organizationId);

        return campaignRepository.findByOrganizationId(organizationId, pageable)
                .map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public List<CampaignDTO> getActiveCampaigns() {
        log.debug("Fetching active campaigns");

        return campaignRepository.findByStatus(Campaign.CampaignStatus.ACTIVE)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<CampaignDTO> getActiveCampaigns(Pageable pageable) {
        log.debug("Fetching active campaigns with pagination");

        return campaignRepository.findByStatus(Campaign.CampaignStatus.ACTIVE, pageable)
                .map(this::convertToDTO);
    }

    public CampaignDTO activateCampaign(UUID id) {
        log.info("Activating campaign: {}", id);

        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign", id));

        if (campaign.getStatus() == Campaign.CampaignStatus.ACTIVE) {
            throw new ValidationException("Campaign is already active");
        }

        campaign.setStatus(Campaign.CampaignStatus.ACTIVE);
        campaign.setStartDate(LocalDateTime.now());
        campaign.setUpdatedAt(LocalDateTime.now());

        campaign = campaignRepository.save(campaign);
        log.info("Campaign activated successfully: {}", id);

        return convertToDTO(campaign);
    }

    public void addDonation(UUID id, BigDecimal amount) {
        log.info("Adding donation of {} to campaign: {}", amount, id);

        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign", id));

        campaign.setCollectedAmount(campaign.getCollectedAmount().add(amount));
        campaign.setDonorCount(campaign.getDonorCount() + 1);
        campaign.setUpdatedAt(LocalDateTime.now());

        // Check if campaign is completed
        if (campaign.isCompleted() && campaign.getStatus() != Campaign.CampaignStatus.COMPLETED) {
            campaign.setStatus(Campaign.CampaignStatus.COMPLETED);
            log.info("Campaign completed: {}", id);
        }

        campaignRepository.save(campaign);
    }

    public void deleteCampaign(UUID id) {
        log.info("Deleting campaign: {}", id);

        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign", id));

        if (campaign.getDonorCount() > 0) {
            throw new ValidationException("Cannot delete campaign with existing donations");
        }

        campaignRepository.delete(campaign);
        log.info("Campaign deleted successfully: {}", id);
    }

    private void validateCreateRequest(CreateCampaignRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new ValidationException("Campaign title is required");
        }

        if (request.getTargetAmount() == null || request.getTargetAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Campaign target amount must be greater than 0");
        }

        if (request.getOrganizationId() == null) {
            throw new ValidationException("Organization ID is required");
        }
    }

    private CampaignDTO convertToDTO(Campaign campaign) {
        return CampaignDTO.builder()
                .id(campaign.getId())
                .title(campaign.getTitle())
                .description(campaign.getDescription())
                .targetAmount(campaign.getTargetAmount())
                .collectedAmount(campaign.getCollectedAmount())
                .status(campaign.getStatus().name())
                .organizationId(campaign.getOrganizationId())
                .createdAt(campaign.getCreatedAt())
                .updatedAt(campaign.getUpdatedAt())
                .startDate(campaign.getStartDate())
                .endDate(campaign.getEndDate())
                .category(campaign.getCategory())
                .donorCount(campaign.getDonorCount())
                .imageUrl(campaign.getImages() != null && !campaign.getImages().isEmpty() ? campaign.getImages().get(0)
                        : null)
                .build();
    }
}
