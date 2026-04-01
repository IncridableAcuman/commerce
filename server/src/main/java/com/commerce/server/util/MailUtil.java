package com.commerce.server.util;

import com.commerce.server.config.RabbitMQConfig;
import com.commerce.server.dto.EmailPayload;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MailUtil {
    private final JavaMailSender javaMailSender;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void sendMail(EmailPayload payload){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(payload.getTo());
        message.setSubject(payload.getSubject());
        message.setText(payload.getText());
        javaMailSender.send(message);
    }
}
