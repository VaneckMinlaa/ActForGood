package com.actforgood.wallet.dto;

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
public class WalletTransactionDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private UUID id;
    private UUID walletId;
    private String transactionType;
    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private String status;
    private String description;
    private String referenceId;
    private String recipientId;
    private Instant createdAt;
}
