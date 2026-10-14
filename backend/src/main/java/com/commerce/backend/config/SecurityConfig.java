package com.commerce.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final CorsConfig corsConfig;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors-> cors.configurationSource(corsConfig.corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(
                        auth-> auth
                                .requestMatchers(
                                        "/auth/**",
                                        "/file/**",
                                        "/uploads/**",
                                        "/oauth2/**",
                                        "/login/oauth2/**",
                                        "/actuator/**"
                                ).permitAll()
                                .requestMatchers(org.springframework.http.HttpMethod.GET, "/products/**").permitAll()
                                .requestMatchers(org.springframework.http.HttpMethod.POST, "/products/upload-image").hasAnyRole("ADMIN", "MANAGER")
                                .requestMatchers(org.springframework.http.HttpMethod.POST, "/products/**").hasAnyRole("ADMIN", "MANAGER")
                                .requestMatchers(org.springframework.http.HttpMethod.PUT, "/products/**").hasAnyRole("ADMIN", "MANAGER")
                                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/products/**").hasAnyRole("ADMIN", "MANAGER")
                                .requestMatchers("/admin/users/**").hasRole("ADMIN")
                                .requestMatchers("/admin/analytics/**").hasAnyRole("ADMIN", "MANAGER")
                                .requestMatchers("/orders/admin/**").hasAnyRole("ADMIN", "MANAGER")
                                .requestMatchers(org.springframework.http.HttpMethod.POST, "/orders").permitAll()
                                .requestMatchers(org.springframework.http.HttpMethod.GET, "/orders/track/**").permitAll()
                                .requestMatchers("/orders/**").authenticated()
                                .requestMatchers("/users/**").authenticated()
                                .anyRequest().authenticated())

                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuth2AuthenticationSuccessHandler)
                )
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(new org.springframework.security.web.authentication.HttpStatusEntryPoint(org.springframework.http.HttpStatus.UNAUTHORIZED))
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}
