package com.example.authservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String message;
    private String accessToken;
    private UserResponse user;
}