package com.commerce.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {
    public void sendOTP(){
        int opt = Math.toIntExact(Math.round(Math.random() * 10000));
    }
}
