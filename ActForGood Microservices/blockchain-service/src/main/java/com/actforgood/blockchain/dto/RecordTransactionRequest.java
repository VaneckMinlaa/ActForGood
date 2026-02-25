package com.actforgood.blockchain.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecordTransactionRequest {

    @NotNull(message = "Payment ID is required")
    private UUID paymentId;

    @NotNull(message = "Donor ID is required")
    private UUID donorId;

    @NotNull(message = "Campaign ID is required")
    private UUID campaignId;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    private String previousHash;
}
