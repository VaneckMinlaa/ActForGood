package com.actforgood.blockchain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "blockchain_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlockchainTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentId;
    private String donorId;
    private String campaignId;
    private Double amount;

    @Column(unique = true)
    private String hash;

    private String previousHash;
    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    public enum TransactionStatus {
        PENDING, CONFIRMED, FAILED
    }
}
