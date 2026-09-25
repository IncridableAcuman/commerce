package com.commerce.backend.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {
    public static final String QUEUE_NAME = "queue_name";
    public static final String EXCHANGE = "exchange_name";
    public static final String ROUTING_KEY = "routing_key";

    @Bean
    Queue queue(){
        return new Queue(QUEUE_NAME);
    }
    @Bean
    DirectExchange directExchange(){
        return new DirectExchange(EXCHANGE);
    }
    @Bean
    Binding binding(Queue queue,DirectExchange exchange){
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY);
    }
    @Bean
    public MessageConverter jsonMessageConverter(){
        return new JacksonJsonMessageConverter();
    }
    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory factory){
        RabbitTemplate template = new RabbitTemplate();
        template.setConnectionFactory(factory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
