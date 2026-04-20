package com.commerce.server.producer;

import com.commerce.server.config.RabbitMQConfig;
import com.commerce.server.dto.EmailPayload;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RabbitMQProducer {
    private final RabbitTemplate template;

    public void queueEmail(EmailPayload payload){
        template
                .convertAndSend(
                        RabbitMQConfig.QUEUE_EXCHANGE,
                        RabbitMQConfig.ROUTING_KEY,
                        payload
                );
    }
}
