package com.commerce.backend.service;

import com.commerce.backend.config.RabbitMqConfig;
import com.commerce.backend.dto.EmailPayload;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {
    private final RabbitTemplate template;

    public void sendMessageWithRabbitMq(EmailPayload payload){
        template
                .convertAndSend(
                        RabbitMqConfig.EXCHANGE,
                        RabbitMqConfig.ROUTING_KEY,
                        payload
                );
    }
}
