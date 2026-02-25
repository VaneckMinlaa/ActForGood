package com.actforgood.campaign.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampaignDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private UUID id;
    private String title;
    private String description;
    private BigDecimal targetAmount;
    private BigDecimal collectedAmount;
    private String status;
    private UUID organizationId;
    private String organizationName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String category;
    private Integer donorCount;
    private String imageUrl;
}
