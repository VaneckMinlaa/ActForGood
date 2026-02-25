package com.actforgood.blockchain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlockchainTransactionDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private UUID id;
    private UUID paymentId;
    private UUID donorId;
    private UUID campaignId;
    private BigDecimal amount;
    private String hash;
    private String previousHash;
    private String status;
    private Instant createdAt;
}
