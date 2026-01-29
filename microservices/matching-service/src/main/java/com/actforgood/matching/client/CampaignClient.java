package com.actforgood.matching.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "campaign-service")
public interface CampaignClient {
    
    @GetMapping("/api/campaigns/active")
    List<Object> getActiveCampaigns();
}
