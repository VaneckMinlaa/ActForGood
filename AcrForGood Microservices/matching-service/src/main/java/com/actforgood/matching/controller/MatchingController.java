package com.actforgood.matching.controller;

import com.actforgood.matching.model.MatchScore;
import com.actforgood.matching.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matching")
public class MatchingController {
    
    @Autowired
    private MatchingService matchingService;
    
    @GetMapping("/recommendations/{donorId}")
    public ResponseEntity<List<MatchScore>> getRecommendations(
            @PathVariable String donorId,
            @RequestParam(required = false, defaultValue = "10") Integer limit) {
        try {
            List<MatchScore> recommendations = matchingService.getRecommendations(donorId, limit);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
