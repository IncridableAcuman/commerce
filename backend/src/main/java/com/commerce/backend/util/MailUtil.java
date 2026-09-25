package com.commerce.backend.util;

import com.commerce.backend.config.RabbitMqConfig;
import com.commerce.backend.dto.EmailPayload;
import com.commerce.backend.exception.CustomInternalServerException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MailUtil {
    private final JavaMailSender mailSender;

    @RabbitListener(queues = RabbitMqConfig.QUEUE_NAME)
    public void sendMail(EmailPayload payload){
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setTo(payload.to());
            helper.setSubject(payload.subject());
            helper.setText(payload.text());
            // sending
            mailSender.send(message);
        } catch (MessagingException e){
            throw new CustomInternalServerException();
        }
    }
}
