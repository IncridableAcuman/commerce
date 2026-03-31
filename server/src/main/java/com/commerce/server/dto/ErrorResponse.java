package com.commerce.server.dto;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public record ErrorResponse(
        int status,
        String error,
        String message,
        LocalDateTime timestamp
) {
    public static ErrorResponse from(Exception e, HttpStatus status){
        return new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                e.getMessage(),
                LocalDateTime.now()
        );
    }
}
