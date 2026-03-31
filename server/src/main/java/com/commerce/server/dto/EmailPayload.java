package com.commerce.server.dto;

import lombok.Data;

@Data
public class EmailPayload {
    private String to;
    private String subject;
    private String text;
}
