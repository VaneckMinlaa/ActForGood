package com.actforgood.gateway.filter;

import com.actforgood.gateway.dto.ErrorResponse;
import com.actforgood.gateway.service.JwtService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

/**
 * JWT Authentication Filter - Valide les tokens JWT et injecte l'ID utilisateur en header
 * Appliqué aux routes protégées
 */
@Component
@Slf4j
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    @Autowired
    private JwtService jwtService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public JwtAuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getPath().value();

            log.debug("Processing request: {} {}", request.getMethod(), path);

            // Check for authorization header
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                log.warn("Missing authorization header for: {}", path);
                return sendError(exchange,
                    ErrorResponse.unauthorized("Missing authorization header", path));
            }

            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                log.warn("Invalid authorization header format for: {}", path);
                return sendError(exchange,
                    ErrorResponse.unauthorized("Invalid authorization header format", path));
            }

            String token = authHeader.substring(7);

            try {
                // Validate token and extract claims
                Claims claims = jwtService.validateAndGetClaims(token);
                String userId = claims.getSubject();

                log.debug("JWT validated for user: {} - path: {}", userId, path);

                // Add user ID to request headers
                ServerHttpRequest modifiedRequest = request.mutate()
                        .header("X-User-Id", userId)
                        .header("X-User-Email", claims.get("email", String.class))
                        .build();

                ServerWebExchange modifiedExchange = exchange.mutate()
                        .request(modifiedRequest)
                        .build();

                return chain.filter(modifiedExchange);
            } catch (io.jsonwebtoken.JwtException ex) {
                log.warn("JWT validation failed: {} - path: {}", ex.getMessage(), path);
                return sendError(exchange,
                    ErrorResponse.unauthorized("Invalid or expired token: " + ex.getMessage(), path));
            } catch (Exception ex) {
                log.error("Unexpected error during JWT validation: ", ex);
                return sendError(exchange,
                    ErrorResponse.unauthorized("Authentication failed", path));
            }
        };
    }

    /**
     * Envoie une réponse d'erreur JSON
     */
    private Mono<Void> sendError(ServerWebExchange exchange, ErrorResponse errorResponse) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        try {
            byte[] bytes = objectMapper.writeValueAsBytes(errorResponse);
            return response.writeWith(Mono.fromCallable(() ->
                response.bufferFactory().wrap(bytes)
            ));
        } catch (JsonProcessingException e) {
            log.error("Error serializing error response: ", e);
            return response.setComplete();
        }
    }

    /**
     * Configuration for the JWT Authentication Filter
     */
    public static class Config {
        // Can be extended with additional configuration if needed
    }
}
