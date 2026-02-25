package com.actforgood.gateway.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private boolean success;
    private String message;
    private String errorCode;
    private String path;
    private long timestamp;
    private String traceId;

    public static ErrorResponse of(String message, String errorCode, String path) {
        return ErrorResponse.builder()
                .success(false)
                .message(message)
                .errorCode(errorCode)
                .path(path)
                .timestamp(System.currentTimeMillis())
                .traceId(System.nanoTime() + "-" + Thread.currentThread().getId())
                .build();
    }

    public static ErrorResponse unauthorized(String message, String path) {
        return of(message, "UNAUTHORIZED", path);
    }

    public static ErrorResponse forbidden(String message, String path) {
        return of(message, "FORBIDDEN", path);
    }

    public static ErrorResponse badRequest(String message, String path) {
        return of(message, "BAD_REQUEST", path);
    }
}
