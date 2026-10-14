package com.commerce.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        int status,
        String error,
        String message,
        String path,
        Map<String, String> validationErrors,
        LocalDateTime errorTime
) {
    public static ErrorResponse from(HttpStatus status, Exception exception) {
        return new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                exception.getMessage(),
                null,
                null,
                LocalDateTime.now()
        );
    }

    public static ErrorResponse from(HttpStatus status, String message) {
        return new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                message,
                null,
                null,
                LocalDateTime.now()
        );
    }

    public static ErrorResponse of(HttpStatus status, String message, String path) {
        return new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                message,
                path,
                null,
                LocalDateTime.now()
        );
    }

    public static ErrorResponse ofValidation(HttpStatus status, String message, String path, Map<String, String> validationErrors) {
        return new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                message,
                path,
                validationErrors,
                LocalDateTime.now()
        );
    }
}
