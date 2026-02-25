package com.actforgood.payment.dto;

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
public class PaymentDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private UUID id;
    private UUID donorId;
    private UUID campaignId;
    private BigDecimal amount;
    private String method;
    private String provider;
    private String status;
    private String transactionId;
    private String blockchainHash;
    private Instant createdAt;
    private Instant updatedAt;
}
