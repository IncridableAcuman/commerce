package com.commerce.server.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    private static final String QUEUE_NAME="QUEUE";
    private static final String QUEUE_EXCHANGE="EXCHANGE";
    private static final String ROUTING_KEY="ROUTING";

    @Bean
    Queue queue(){
        return new Queue(QUEUE_NAME,true); // creating queue for saving message
    }

    @Bean
    DirectExchange directExchange(){
        return new DirectExchange(QUEUE_EXCHANGE); // creating direct for which one queue
    }

    @Bean
    Binding binding(Queue queue,DirectExchange exchange){
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY); // combining with queue and direct exchange
    }

    @Bean
    public MessageConverter jsonMessageConverter(){ // serialize/desserilize
        return new JacksonJsonMessageConverter();
    }

    @Bean
    public AmqpTemplate template(ConnectionFactory factory){
    final RabbitTemplate template = new RabbitTemplate(factory);
    template.setMessageConverter(jsonMessageConverter());
    return template;
    }

}
