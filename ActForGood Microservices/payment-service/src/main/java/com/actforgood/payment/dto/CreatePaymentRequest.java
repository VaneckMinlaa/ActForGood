package com.actforgood.payment.dto;

import jakarta.validation.constraints.*;
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
public class CreatePaymentRequest {

    @NotNull(message = "Donor ID is required")
    private UUID donorId;

    @NotNull(message = "Campaign ID is required")
    private UUID campaignId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "500", message = "Minimum donation amount is 500")
    @DecimalMax(value = "1000000000", message = "Payment amount exceeds maximum limit")
    private BigDecimal amount;

    @NotBlank(message = "Payment method is required")
    private String method;

    @NotBlank(message = "Payment provider is required")
    private String provider;

    // Optional fields
    private String transactionId;
    private String blockchainHash;
}
