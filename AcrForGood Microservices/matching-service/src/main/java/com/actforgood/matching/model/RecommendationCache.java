package com.actforgood.matching.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entité minimale pour que le matching-service utilise sa base PostgreSQL.
 * Peut servir plus tard pour mettre en cache des recommandations.
 */
@Entity
@Table(name = "recommendation_cache")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String donorId;
    private String campaignIds; // JSON ou liste sérialisée
    private LocalDateTime createdAt;
}
