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

        String html = """
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                            <h2 style="color: #2c3e50;">Reset Password</h2>
                
                            <p>Salom, %s 👋</p>
                
                            <p>Parolingizni tiklash uchun quyidagi tugmani bosing:</p>
                
                            <a href="%s"
                               style="
                                   display: inline-block;
                                   padding: 12px 24px;
                                   background-color: #4CAF50;
                                   color: white;
                                   text-decoration: none;
                                   border-radius: 6px;
                                   font-weight: bold;
                                   margin-top: 10px;">
                                Reset Password
                            </a>
                
                            <p style="margin-top: 20px; color: gray;">
                                Agar bu siz bo‘lmasangiz, ushbu xabarni e’tiborsiz qoldiring.
                            </p>
                        </div>
                """.formatted(
                        user.getEmail(),
                url
        );

        EmailPayload payload = new EmailPayload(user.getEmail(), "Reset Password",html);
        rabbitMQProducer.queueEmail(payload);
    }

    public void sendVerificationEmail(User user){
        String token = jwtUtil.generateAccessToken(user);

        String url = "http://localhost:5173/verify-email?token="+token;

        String html = """
                <h2>Email tasdiqlash</h2>
                        <p>Salom, %s</p>
                        <a href="%s">Emailni tasdiqlash</a>
                """.formatted(user.getEmail(),url);

        EmailPayload payload = new EmailPayload(
                user.getEmail(),
                "Verify Email",
                html
        );

        rabbitMQProducer.queueEmail(payload);
    }
}
