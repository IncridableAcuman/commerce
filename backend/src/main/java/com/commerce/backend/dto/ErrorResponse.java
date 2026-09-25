package com.commerce.backend.dto;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public record ErrorResponse(
        int status,
        String error,
        String message,
        LocalDateTime errorTime
) {
    public static ErrorResponse from(HttpStatus status, Exception exception){
        return new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                exception.getMessage(),
                LocalDateTime.now()
        );
    }
}
