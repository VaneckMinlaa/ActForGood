package com.actforgood.payment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    private String id;
    private String donorId;
    private String campaignId;
    private Double amount;
    private PaymentMethod method; // MOBILE_MONEY, CRYPTO, CARD
    private PaymentProvider provider; // ORANGE_MONEY, MTN_MOMO, STRIPE, etc.
    private PaymentStatus status; // PENDING, COMPLETED, FAILED, REFUNDED
    private String transactionId; // External transaction ID
    private String blockchainHash; // Hash from blockchain service
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public enum PaymentMethod {
        MOBILE_MONEY, CRYPTO, CARD
    }
    
    public enum PaymentProvider {
        ORANGE_MONEY, MTN_MOMO, STRIPE, PAYPAL, BITCOIN, ETHEREUM
    }
    
    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED
    }
}
