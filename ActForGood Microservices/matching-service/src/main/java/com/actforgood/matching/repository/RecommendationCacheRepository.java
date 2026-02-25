package com.actforgood.matching.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.actforgood.matching.model.RecommendationCache;

@Repository
public interface RecommendationCacheRepository extends JpaRepository<RecommendationCache, Long> {
}
