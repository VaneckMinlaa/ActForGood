package com.actforgood.blockchain.controller;

import com.actforgood.blockchain.model.BlockchainTransaction;
import com.actforgood.blockchain.service.BlockchainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blockchain")
public class BlockchainController {
    
    @Autowired
    private BlockchainService blockchainService;
    
    @PostMapping("/transactions")
    public ResponseEntity<String> recordTransaction(@RequestBody Object payment) {
        try {
            String hash = blockchainService.recordTransaction(payment);
            return ResponseEntity.ok(hash);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/transactions/{hash}")
    public ResponseEntity<BlockchainTransaction> getTransaction(@PathVariable String hash) {
        try {
            BlockchainTransaction transaction = blockchainService.getTransactionByHash(hash);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
