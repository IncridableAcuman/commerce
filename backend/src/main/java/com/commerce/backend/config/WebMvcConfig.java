package com.commerce.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Value("${file.upload.dir}")
    private String uploadDir;

    @Bean
    public void addResourceHandlers(ResourceHandlerRegistry registry){
        registry
                .addResourceHandler()
                .addResourceLocations("file:" + uploadDir);
    }
}
