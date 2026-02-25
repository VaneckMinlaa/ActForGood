package com.actforgood.matching.dto;

import com.actforgood.matching.model.MatchFactors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchScoreDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String campaignId;
    private String campaignTitle;
    private Double score; // 0.0 to 1.0
    private String reason; // Explanation of the match
    private MatchFactors factors;
}
