package com.commerce.backend.exception;

import com.commerce.backend.constants.Messages;

public class CustomNotFoundException extends RuntimeException{
    public CustomNotFoundException(){
        super(Messages.NOT_FOUND);
    }
}
