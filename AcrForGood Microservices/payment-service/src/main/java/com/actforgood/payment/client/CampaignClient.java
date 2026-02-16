package com.actforgood.payment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "campaign-service")
public interface CampaignClient {
    
    @PutMapping("/api/campaigns/{id}/amount")
    void updateCampaignAmount(@PathVariable String id, @RequestParam Double amount);
}
