package com.commerce.backend.config;

import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Slf4j
@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url:${DB_URL:${DATABASE_URL:jdbc:postgresql://localhost:5432/commerce}}}")
    private String rawUrl;

    @Value("${spring.datasource.username:${DB_USERNAME:admin2003}}")
    private String defaultUsername;

    @Value("${spring.datasource.password:${DB_PASSWORD:admin2003}}")
    private String defaultPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");

        String jdbcUrl = rawUrl;
        String username = defaultUsername;
        String password = defaultPassword;

        if (rawUrl != null && (rawUrl.startsWith("postgresql://") || rawUrl.startsWith("postgres://"))) {
            try {
                // postgresql://user:pass@host:port/database?params -> http://user:pass@host:port/database?params
                String dummyUrl = rawUrl.replaceFirst("^postgres(ql)?://", "http://");
                URI uri = URI.create(dummyUrl);

                String userInfo = uri.getUserInfo();
                if (userInfo != null && !userInfo.isEmpty()) {
                    String[] userParts = userInfo.split(":", 2);
                    username = userParts[0];
                    if (userParts.length > 1) {
                        password = userParts[1];
                    }
                }

                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath();
                String query = uri.getQuery();

                StringBuilder sb = new StringBuilder("jdbc:postgresql://")
                        .append(host)
                        .append(":")
                        .append(port)
                        .append(path);

                if (query != null && !query.isEmpty()) {
                    sb.append("?").append(query);
                } else if (!rawUrl.contains("sslmode")) {
                    sb.append("?sslmode=require");
                }

                jdbcUrl = sb.toString();
                log.info("Production DataSource initialized from standard postgres URL for host: {}", host);
            } catch (Exception e) {
                log.warn("Could not parse PostgreSQL URI directly: {}. Prepended 'jdbc:' to URL.", e.getMessage());
                jdbcUrl = "jdbc:" + rawUrl;
            }
        }

        dataSource.setJdbcUrl(jdbcUrl);
        dataSource.setUsername(username);
        dataSource.setPassword(password);

        // Production-ready connection pooling for cloud providers (Neon, Render, Supabase)
        dataSource.setMaximumPoolSize(4);
        dataSource.setMinimumIdle(1);
        dataSource.setConnectionTimeout(20000);
        dataSource.setIdleTimeout(300000);
        dataSource.setMaxLifetime(1200000);

        return dataSource;
    }
}
