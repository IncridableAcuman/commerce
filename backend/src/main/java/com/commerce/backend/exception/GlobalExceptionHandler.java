package com.commerce.backend.exception;

import com.commerce.backend.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomBadRequestException.class)
    public ResponseEntity<ErrorResponse> customBadRequestExceptionHandler(CustomBadRequestException exception){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.from(HttpStatus.BAD_REQUEST,exception));}

    @ExceptionHandler(CustomNotFoundException.class)
    public ResponseEntity<ErrorResponse> customNotFoundExceptionHandler(CustomNotFoundException exception){
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorResponse.from(HttpStatus.NOT_FOUND,exception));}

    @ExceptionHandler(CustomUnauthorizedException.class)
    public ResponseEntity<ErrorResponse> customUnauthorizedExceptionHandler(CustomUnauthorizedException exception){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.from(HttpStatus.UNAUTHORIZED,exception));}
    @ExceptionHandler(CustomInternalServerException.class)
    public ResponseEntity<ErrorResponse> customInternalServerExceptionHandler(CustomInternalServerException exception){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.from(HttpStatus.INTERNAL_SERVER_ERROR,exception));}

}
