package com.actforgood.gateway.config;

import com.actforgood.gateway.filter.JwtAuthenticationFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder, JwtAuthenticationFilter filter) {
        return builder.routes()
                // User Service
                .route("user-service", r -> r
                        .path("/api/users/**")
                        .filters(f -> f.filter(filter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://user-service"))
                
                // Campaign Service
                .route("campaign-service", r -> r
                        .path("/api/campaigns/**")
                        .uri("lb://campaign-service"))
                
                // Matching Service
                .route("matching-service", r -> r
                        .path("/api/matching/**")
                        .filters(f -> f.filter(filter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://matching-service"))
                
                // Payment Service
                .route("payment-service", r -> r
                        .path("/api/payments/**")
                        .filters(f -> f.filter(filter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://payment-service"))
                
                // Blockchain Service
                .route("blockchain-service", r -> r
                        .path("/api/blockchain/**")
                        .uri("lb://blockchain-service"))
                
                // Public routes (no auth)
                .route("auth-route", r -> r
                        .path("/api/auth/**")
                        .uri("lb://user-service"))
                
                .build();
    }
}
