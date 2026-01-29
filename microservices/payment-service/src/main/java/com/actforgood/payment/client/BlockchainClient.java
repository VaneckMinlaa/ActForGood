package com.actforgood.payment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "blockchain-service")
public interface BlockchainClient {
    
    @PostMapping("/api/blockchain/transactions")
    String recordTransaction(@RequestBody Object payment);
}
