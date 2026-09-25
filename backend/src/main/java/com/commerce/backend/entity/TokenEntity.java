package com.commerce.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tokens")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter @Builder
public class TokenEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(name = "refresh_token",nullable = false)
    private String refreshToken;

    @Column(name = "expiration",nullable = false)
    private LocalDateTime expiration;
}
