package com.actforgood.gateway.exception;

public class JwtException extends RuntimeException {
    private String errorCode;

    public JwtException(String message) {
        super(message);
        this.errorCode = "JWT_ERROR";
    }

    public JwtException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
