package com.commerce.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailTemplateService {
    private final SpringTemplateEngine templateEngine;

    public String processTemplate(String templateName, Map<String,Object> variables){
        Context context = new Context();
        context.setVariables(variables);
        return templateEngine.process("/" + templateName,context);
    }
}
