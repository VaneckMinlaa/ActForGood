package com.actforgood.campaign.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "campaigns")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Campaign {
    @Id
    private String id;
    private String organizationId; // Reference to user-service
    private String title;
    private String description;
    private String category; // Education, Health, Orphans, etc.
    private String location;
    private String region;
    private Double targetAmount;
    private Double currentAmount;
    private Integer donorCount;
    private CampaignStatus status; // DRAFT, ACTIVE, COMPLETED, CANCELLED
    private UrgencyLevel urgency; // LOW, MEDIUM, HIGH, CRITICAL
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> images; // URLs to campaign images
    private List<String> documents; // URLs to supporting documents
    private ImpactMetrics impactMetrics;
    
    public enum CampaignStatus {
        DRAFT, ACTIVE, COMPLETED, CANCELLED
    }
    
    public enum UrgencyLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }
}
