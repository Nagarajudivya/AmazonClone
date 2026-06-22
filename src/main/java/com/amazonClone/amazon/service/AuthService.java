package com.amazonClone.amazon.service;

import com.amazonClone.amazon.dto.request.LoginRequest;
import com.amazonClone.amazon.dto.request.RefreshTokenRequest;
import com.amazonClone.amazon.dto.request.RegisterRequest;
import com.amazonClone.amazon.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    void logout(String email);
}