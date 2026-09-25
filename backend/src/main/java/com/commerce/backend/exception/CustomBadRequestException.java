package com.commerce.backend.exception;

public class CustomBadRequestException extends RuntimeException{
    public CustomBadRequestException(String message){
        super(message);
    }
}
