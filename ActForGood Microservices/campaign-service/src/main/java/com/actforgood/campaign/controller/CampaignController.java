package com.actforgood.campaign.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.actforgood.campaign.dto.ApiResponse;
import com.actforgood.campaign.dto.CampaignDTO;
import com.actforgood.campaign.dto.CreateCampaignRequest;
import com.actforgood.campaign.service.CampaignService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/campaigns")
@Slf4j
public class CampaignController {

        @Autowired
        private CampaignService campaignService;

        @PostMapping
        public ResponseEntity<ApiResponse<CampaignDTO>> createCampaign(
                        @Valid @RequestBody CreateCampaignRequest request) {
                log.info("Creating campaign: {}", request.getTitle());

                CampaignDTO campaign = campaignService.createCampaign(request);

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(ApiResponse.success("Campaign created successfully", campaign));
        }

        @GetMapping
        public ResponseEntity<ApiResponse<Page<CampaignDTO>>> getAllCampaigns(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size) {
                log.info("Fetching all campaigns: page={}, size={}", page, size);

                Pageable pageable = PageRequest.of(page, size);
                Page<CampaignDTO> campaigns = campaignService.getAllCampaigns(pageable);

                return ResponseEntity.ok(ApiResponse.success(
                                "Campaigns retrieved successfully",
                                campaigns));
        }

        @GetMapping("/active")
        public ResponseEntity<ApiResponse<Page<CampaignDTO>>> getActiveCampaigns(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size) {
                log.info("Fetching active campaigns");

                Pageable pageable = PageRequest.of(page, size);
                Page<CampaignDTO> campaigns = campaignService.getActiveCampaigns(pageable);

                return ResponseEntity.ok(ApiResponse.success(
                                "Active campaigns retrieved successfully",
                                campaigns));
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<CampaignDTO>> getCampaignById(
                        @PathVariable UUID id) {
                log.info("Fetching campaign: {}", id);

                CampaignDTO campaign = campaignService.getCampaignById(id);

                return ResponseEntity.ok(ApiResponse.success(
                                "Campaign retrieved successfully",
                                campaign));
        }

        @GetMapping("/organization/{organizationId}")
        public ResponseEntity<ApiResponse<Page<CampaignDTO>>> getCampaignsByOrganization(
                        @PathVariable UUID organizationId,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size) {
                log.info("Fetching campaigns for organization: {}", organizationId);

                Pageable pageable = PageRequest.of(page, size);
                Page<CampaignDTO> campaigns = campaignService.getCampaignsByOrganization(organizationId, pageable);

                return ResponseEntity.ok(ApiResponse.success(
                                "Organization campaigns retrieved successfully",
                                campaigns));
        }

        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse<CampaignDTO>> updateCampaign(
                        @PathVariable UUID id,
                        @Valid @RequestBody CreateCampaignRequest request) {
                log.info("Updating campaign: {}", id);

                CampaignDTO campaign = campaignService.updateCampaign(id, request);

                return ResponseEntity.ok(ApiResponse.success(
                                "Campaign updated successfully",
                                campaign));
        }

        @PutMapping("/{id}/activate")
        public ResponseEntity<ApiResponse<CampaignDTO>> activateCampaign(
                        @PathVariable UUID id) {
                log.info("Activating campaign: {}", id);

                CampaignDTO campaign = campaignService.activateCampaign(id);

                return ResponseEntity.ok(ApiResponse.success(
                                "Campaign activated successfully",
                                campaign));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<?>> deleteCampaign(
                        @PathVariable UUID id) {
                log.info("Deleting campaign: {}", id);

                campaignService.deleteCampaign(id);

                return ResponseEntity.ok(ApiResponse.success("Campaign deleted successfully", null));
        }
}
