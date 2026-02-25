package com.actforgood.gateway.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

/**
 * JWT Service - Gestion de la validation et extraction des tokens JWT
 */
@Service
@Slf4j
public class JwtService {

    @Value("${jwt.secret:actforgood-secret-key-change-in-production-minimum-256-bits}")
    private String jwtSecret;

    /**
     * Valide un token JWT et retourne les claims
     */
    public Claims validateAndGetClaims(String token) {
        try {
            log.debug("Validating JWT token");

            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            log.debug("JWT token validated successfully. User: {}", claims.getSubject());
            return claims;
        } catch (ExpiredJwtException ex) {
            log.warn("JWT token is expired");
            throw new io.jsonwebtoken.JwtException("Token expired", ex);
        } catch (MalformedJwtException ex) {
            log.warn("Invalid JWT token format");
            throw new io.jsonwebtoken.JwtException("Invalid token format", ex);
        } catch (SignatureException ex) {
            log.warn("Invalid JWT signature");
            throw new io.jsonwebtoken.JwtException("Invalid signature", ex);
        } catch (Exception ex) {
            log.error("Token validation error: ", ex);
            throw new io.jsonwebtoken.JwtException("Token validation failed", ex);
        }
    }

    /**
     * Extrait l'ID utilisateur du token
     */
    public String extractUserId(String token) {
        Claims claims = validateAndGetClaims(token);
        return claims.getSubject();
    }

    /**
     * Extrait une claim personnalisée du token
     */
    public String extractClaim(String token, String claimName) {
        Claims claims = validateAndGetClaims(token);
        Object claim = claims.get(claimName);
        return claim != null ? claim.toString() : null;
    }

    /**
     * Vérifie si un token est valide
     */
    public boolean isTokenValid(String token) {
        try {
            validateAndGetClaims(token);
            return true;
        } catch (Exception ex) {
            log.debug("Token validation failed: {}", ex.getMessage());
            return false;
        }
    }
}
