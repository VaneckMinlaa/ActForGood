package com.actforgood.blockchain.controller;

import com.actforgood.blockchain.dto.ApiResponse;
import com.actforgood.blockchain.dto.BlockchainTransactionDTO;
import com.actforgood.blockchain.dto.RecordTransactionRequest;
import com.actforgood.blockchain.service.BlockchainService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/blockchain")
@Slf4j
public class BlockchainController {

    @Autowired
    private BlockchainService blockchainService;

    @PostMapping("/transactions")
    public ResponseEntity<ApiResponse<BlockchainTransactionDTO>> recordTransaction(
        @Valid @RequestBody RecordTransactionRequest request
    ) {
        log.info("POST /api/blockchain/transactions");

        BlockchainTransactionDTO transaction = blockchainService.recordTransaction(request);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Transaction recorded successfully", transaction));
    }

    @PostMapping("/transactions/payment")
    public ResponseEntity<ApiResponse<String>> recordPaymentTransaction(
        @RequestBody Object paymentObject
    ) {
        log.info("POST /api/blockchain/transactions/payment");

        String hash = blockchainService.recordPaymentTransaction(paymentObject);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Payment transaction recorded successfully", hash));
    }

    @GetMapping("/transactions/{hash}")
    public ResponseEntity<ApiResponse<BlockchainTransactionDTO>> getTransactionByHash(
        @PathVariable String hash
    ) {
        log.info("GET /api/blockchain/transactions/{}", hash);

        BlockchainTransactionDTO transaction = blockchainService.getTransactionByHash(hash);

        return ResponseEntity.ok(ApiResponse.success("Transaction retrieved successfully", transaction));
    }

    @GetMapping("/transactions/id/{id}")
    public ResponseEntity<ApiResponse<BlockchainTransactionDTO>> getTransactionById(
        @PathVariable UUID id
    ) {
        log.info("GET /api/blockchain/transactions/id/{}", id);

        BlockchainTransactionDTO transaction = blockchainService.getTransactionById(id);

        return ResponseEntity.ok(ApiResponse.success("Transaction retrieved successfully", transaction));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<Page<BlockchainTransactionDTO>>> getAllTransactions(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        log.info("GET /api/blockchain/transactions - page={}, size={}", page, size);

        // Create pageable and fetch from appropriate endpoint
        Pageable pageable = PageRequest.of(page, size);
        Page<BlockchainTransactionDTO> transactions = blockchainService.getConfirmedTransactions(pageable);

        return ResponseEntity.ok(ApiResponse.success("Transactions retrieved successfully", transactions));
    }

    @GetMapping("/transactions/payment/{paymentId}")
    public ResponseEntity<ApiResponse<Page<BlockchainTransactionDTO>>> getPaymentTransactions(
        @PathVariable UUID paymentId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        log.info("GET /api/blockchain/transactions/payment/{}", paymentId);

        Pageable pageable = PageRequest.of(page, size);
        Page<BlockchainTransactionDTO> transactions = blockchainService.getTransactionsByPayment(paymentId, pageable);

        return ResponseEntity.ok(ApiResponse.success("Payment transactions retrieved successfully", transactions));
    }

    @GetMapping("/transactions/donor/{donorId}")
    public ResponseEntity<ApiResponse<Page<BlockchainTransactionDTO>>> getDonorTransactions(
        @PathVariable UUID donorId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        log.info("GET /api/blockchain/transactions/donor/{}", donorId);

        Pageable pageable = PageRequest.of(page, size);
        Page<BlockchainTransactionDTO> transactions = blockchainService.getTransactionsByDonor(donorId, pageable);

        return ResponseEntity.ok(ApiResponse.success("Donor transactions retrieved successfully", transactions));
    }

    @GetMapping("/transactions/campaign/{campaignId}")
    public ResponseEntity<ApiResponse<Page<BlockchainTransactionDTO>>> getCampaignTransactions(
        @PathVariable UUID campaignId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        log.info("GET /api/blockchain/transactions/campaign/{}", campaignId);

        Pageable pageable = PageRequest.of(page, size);
        Page<BlockchainTransactionDTO> transactions = blockchainService.getTransactionsByCampaign(campaignId, pageable);

        return ResponseEntity.ok(ApiResponse.success("Campaign transactions retrieved successfully", transactions));
    }

    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<Boolean>> verifyIntegrity() {
        log.info("GET /api/blockchain/verify");

        boolean isValid = blockchainService.verifyBlockchainIntegrity();

        return ResponseEntity.ok(ApiResponse.success(
            isValid ? "Blockchain integrity verified" : "Blockchain integrity check failed",
            isValid
        ));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Object>> getStats() {
        log.info("GET /api/blockchain/stats");

        long confirmedCount = blockchainService.getConfirmedTransactionCount();

        return ResponseEntity.ok(ApiResponse.success("Blockchain statistics",
            java.util.Map.of("confirmedTransactions", confirmedCount)));
    }
}
