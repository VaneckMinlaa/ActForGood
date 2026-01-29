package com.actforgood.matching.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchFactors {
    private Double preferenceMatch; // Based on donor preferences
    private Double locationMatch; // Geographic proximity
    private Double urgencyScore; // Campaign urgency level
    private Double impactScore; // Potential impact
    private Double budgetMatch; // Budget alignment
}
