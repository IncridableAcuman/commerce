package com.commerce.backend.exception;

public class CustomNotFoundException extends RuntimeException{
    public CustomNotFoundException(){
        super("Not found");
    }
}
