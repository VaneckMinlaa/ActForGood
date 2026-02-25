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
public class WalletDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private UUID id;
    private UUID userId;
    private BigDecimal balance;
    private BigDecimal totalDonated;
    private BigDecimal totalReceived;
    private String status;
    private String currency;
    private Instant createdAt;
    private Instant updatedAt;
}
