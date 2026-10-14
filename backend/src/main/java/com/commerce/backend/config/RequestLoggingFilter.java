package com.commerce.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final String TRACE_ID_HEADER = "X-Trace-Id";
    private static final String TRACE_ID_KEY = "traceId";

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        long startTime = System.currentTimeMillis();

        String existingTraceId = request.getHeader(TRACE_ID_HEADER);
        String traceId = (existingTraceId != null && !existingTraceId.isBlank())
                ? existingTraceId
                : UUID.randomUUID().toString().substring(0, 8);

        MDC.put(TRACE_ID_KEY, traceId);
        response.setHeader(TRACE_ID_HEADER, traceId);

        String uri = request.getRequestURI();
        String method = request.getMethod();
        String queryString = request.getQueryString();
        String fullPath = queryString != null ? uri + "?" + queryString : uri;
        String clientIp = getClientIp(request);

        // Actuator sog'liq tekshiruvlarini logga to'ldirmaslik uchun tekshiruv
        boolean isHealthCheck = uri.contains("/actuator/health");

        if (!isHealthCheck) {
            log.info("--> {} {} [IP: {}]", method, fullPath, clientIp);
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            int status = response.getStatus();

            if (!isHealthCheck) {
                if (status >= 400 && status < 500) {
                    log.warn("<-- {} {} | Status: {} | Duration: {}ms", method, uri, status, duration);
                } else if (status >= 500) {
                    log.error("<-- {} {} | Status: {} | Duration: {}ms", method, uri, status, duration);
                } else {
                    log.info("<-- {} {} | Status: {} | Duration: {}ms", method, uri, status, duration);
                }
            }

            MDC.remove(TRACE_ID_KEY);
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
