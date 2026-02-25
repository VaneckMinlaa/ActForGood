package com.actforgood.campaign.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImpactMetrics {
    private Integer beneficiariesCount;
    private Integer schoolsBuilt;
    private Integer childrenEducated;
    private Integer medicalTreatments;
    private String impactDescription;
    private List<String> impactPhotos;
    private List<String> impactVideos;
    private LocalDateTime lastUpdate;
}
