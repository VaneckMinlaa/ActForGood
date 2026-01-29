package com.actforgood.blockchain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "blockchain_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlockchainTransaction {
    @Id
    private String id;
    private String paymentId;
    private String donorId;
    private String campaignId;
    private Double amount;
    private String hash; // Blockchain hash
    private String previousHash;
    private LocalDateTime timestamp;
    private TransactionStatus status; // PENDING, CONFIRMED, FAILED
    
    public enum TransactionStatus {
        PENDING, CONFIRMED, FAILED
    }
}
