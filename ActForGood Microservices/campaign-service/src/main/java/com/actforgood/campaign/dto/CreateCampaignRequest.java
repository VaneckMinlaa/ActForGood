package com.actforgood.campaign.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCampaignRequest {

    @NotBlank(message = "Campaign title is required")
    @Size(min = 5, max = 255, message = "Title must be 5-255 characters")
    private String title;

    @NotBlank(message = "Campaign description is required")
    @Size(min = 10, max = 5000, message = "Description must be 10-5000 characters")
    private String description;

    @NotNull(message = "Target amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal targetAmount;

    @NotNull(message = "Organization ID is required")
    private UUID organizationId;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @Size(max = 100, message = "Category must be less than 100 characters")
    private String category;

    private String imageUrl;
}
