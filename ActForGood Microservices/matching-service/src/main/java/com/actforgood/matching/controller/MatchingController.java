package com.actforgood.matching.controller;

import com.actforgood.matching.dto.ApiResponse;
import com.actforgood.matching.dto.MatchScoreDTO;
import com.actforgood.matching.service.MatchingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matching")
@Slf4j
public class MatchingController {

    @Autowired
    private MatchingService matchingService;

    @GetMapping("/recommendations/{donorId}")
    public ResponseEntity<ApiResponse<List<MatchScoreDTO>>> getRecommendations(
        @PathVariable String donorId,
        @RequestParam(required = false, defaultValue = "10") Integer limit
    ) {
        log.info("GET /api/matching/recommendations/{} - limit={}", donorId, limit);

        List<MatchScoreDTO> recommendations = matchingService.getRecommendations(donorId, limit);

        return ResponseEntity.ok(ApiResponse.success(
            "Recommendations generated successfully",
            recommendations
        ));
    }
}
