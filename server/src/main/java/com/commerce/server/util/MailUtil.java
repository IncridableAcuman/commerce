package com.commerce.server.util;

import com.commerce.server.config.RabbitMQConfig;
import com.commerce.server.dto.EmailPayload;
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
    private final JavaMailSender javaMailSender;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void sendMail(EmailPayload payload) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message,true,"UTF-8");

        helper.setTo(payload.getTo());
        helper.setSubject(payload.getSubject());
        helper.setText(payload.getText(),true);
        javaMailSender.send(message);
    }
}
