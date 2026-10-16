package com.commerce.backend.service;

import com.commerce.backend.config.RabbitMqConfig;
import com.commerce.backend.dto.EmailPayload;
import com.commerce.backend.util.MailUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailService {
    private final ObjectProvider<RabbitTemplate> templateProvider;
    private final MailUtil mailUtil;

    @Value("${rabbitmq.enabled:true}")
    private boolean rabbitmqEnabled;

    public void sendMessageWithRabbitMq(EmailPayload payload){
        RabbitTemplate template = templateProvider.getIfAvailable();
        if (rabbitmqEnabled && template != null) {
            try {
                template.convertAndSend(
                        RabbitMqConfig.EXCHANGE,
                        RabbitMqConfig.ROUTING_KEY,
                        payload
                );
                return;
            } catch (Exception e) {
                log.warn("RabbitMQ delivery failed ({}), falling back to direct email sending", e.getMessage());
            }
        }
        // Direct sending fallback (e.g. on Render where RabbitMQ is not deployed)
        mailUtil.sendMail(payload);
    }
}

