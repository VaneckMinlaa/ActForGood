package com.actforgood.gateway.config;

import com.actforgood.gateway.filter.JwtAuthenticationFilter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Gateway Configuration - Définit les routes et les filtres pour le API Gateway
 *
 * Routes :
 * - /api/auth/** → user-service (public)
 * - /api/users/** → user-service (JWT required)
 * - /api/campaigns/** → campaign-service (public)
 * - /api/payments/** → payment-service (JWT required)
 * - /api/matching/** → matching-service (JWT required)
 * - /api/blockchain/** → blockchain-service (public)
 */
@Configuration
@Slf4j
public class GatewayConfig {

    /**
     * Définit les routes du API Gateway avec les filtres appropriés
     */
    @Bean
    public RouteLocator customRouteLocator(
            RouteLocatorBuilder builder,
            JwtAuthenticationFilter jwtFilter
    ) {
        log.info("Configuring API Gateway routes");

        return builder.routes()
                // ====== AUTH SERVICE (PUBLIC) ======
                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        .uri("lb://user-service"))

                // ====== USER SERVICE (PROTECTED) ======
                .route("user-service", r -> r
                        .path("/api/users/**")
                        .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://user-service"))

                // ====== CAMPAIGN SERVICE (PUBLIC) ======
                .route("campaign-service", r -> r
                        .path("/api/campaigns/**")
                        .uri("lb://campaign-service"))

                // ====== PAYMENT SERVICE (PROTECTED) ======
                .route("payment-service", r -> r
                        .path("/api/payments/**")
                        .filters(f -> f
                                .filter(jwtFilter.apply(new JwtAuthenticationFilter.Config()))
                                .removeRequestHeader("Cookie"))
                        .uri("lb://payment-service"))

                // ====== MATCHING SERVICE (PROTECTED) ======
                .route("matching-service", r -> r
                        .path("/api/matching/**")
                        .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                        .uri("lb://matching-service"))

                // ====== BLOCKCHAIN SERVICE (PUBLIC) ======
                .route("blockchain-service", r -> r
                        .path("/api/blockchain/**")
                        .uri("lb://blockchain-service"))

                .build();
    }
}
