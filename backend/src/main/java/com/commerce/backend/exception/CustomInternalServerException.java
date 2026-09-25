package com.commerce.backend.exception;

public class CustomInternalServerException extends RuntimeException{
    public CustomInternalServerException(){
        super("Internal Server Error!");
    }
}
