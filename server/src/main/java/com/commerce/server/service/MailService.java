package com.commerce.server.service;

import com.commerce.server.dto.EmailPayload;
import com.commerce.server.entity.User;
import com.commerce.server.producer.RabbitMQProducer;
import com.commerce.server.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {
    private final JwtUtil jwtUtil;
    private final RabbitMQProducer rabbitMQProducer;

    public void sendMail(User user){
        String token = jwtUtil.generateAccessToken(user);
        String url = "http://localhost:5173/reset-password?token="+token;
        EmailPayload payload = new EmailPayload(user.getEmail(), "Reset Password",url);
        rabbitMQProducer.queueEmail(payload);
    }
}
