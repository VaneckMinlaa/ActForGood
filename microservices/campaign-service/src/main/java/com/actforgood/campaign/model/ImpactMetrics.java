package com.actforgood.campaign.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImpactMetrics {
    private Integer beneficiariesCount; // Number of children/people helped
    private Integer schoolsBuilt;
    private Integer childrenEducated;
    private Integer medicalTreatments;
    private String impactDescription;
    private List<String> impactPhotos; // URLs to impact photos
    private List<String> impactVideos; // URLs to impact videos
    private LocalDateTime lastUpdate;
}
