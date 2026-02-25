package com.actforgood.matching.exception;

import com.actforgood.matching.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.Instant;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleResourceNotFound(
            ResourceNotFoundException ex,
            WebRequest request
    ) {
        log.error("Resource not found: {}", ex.getMessage());

        ApiResponse<?> response = ApiResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .timestamp(Instant.now())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGlobalException(
            Exception ex,
            WebRequest request
    ) {
        log.error("Unexpected error occurred: ", ex);

        String traceId = System.currentTimeMillis() + "-" + Thread.currentThread().getId();

        ApiResponse<?> response = ApiResponse.builder()
                .success(false)
                .message("An unexpected error occurred. Trace ID: " + traceId)
                .timestamp(Instant.now())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
