package com.actforgood.campaign.controller;

import com.actforgood.campaign.model.Campaign;
import com.actforgood.campaign.service.CampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {
    
    @Autowired
    private CampaignService campaignService;
    
    @PostMapping
    public ResponseEntity<Campaign> createCampaign(@RequestBody Campaign campaign) {
        try {
            Campaign created = campaignService.createCampaign(campaign);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Campaign>> getAllCampaigns() {
        return ResponseEntity.ok(campaignService.getAllCampaigns());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Campaign>> getActiveCampaigns() {
        return ResponseEntity.ok(campaignService.getActiveCampaigns());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Campaign> getCampaign(@PathVariable String id) {
        try {
            Campaign campaign = campaignService.getCampaignById(id);
            return ResponseEntity.ok(campaign);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/organization/{organizationId}")
    public ResponseEntity<List<Campaign>> getCampaignsByOrganization(@PathVariable String organizationId) {
        return ResponseEntity.ok(campaignService.getCampaignsByOrganization(organizationId));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Campaign> updateCampaign(@PathVariable String id, @RequestBody Campaign campaign) {
        try {
            Campaign updated = campaignService.updateCampaign(id, campaign);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/activate")
    public ResponseEntity<Campaign> activateCampaign(@PathVariable String id) {
        try {
            Campaign campaign = campaignService.activateCampaign(id);
            return ResponseEntity.ok(campaign);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/amount")
    public ResponseEntity<Campaign> updateCampaignAmount(@PathVariable String id, @RequestParam Double amount) {
        try {
            campaignService.updateCampaignAmount(id, amount);
            Campaign campaign = campaignService.getCampaignById(id);
            return ResponseEntity.ok(campaign);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
