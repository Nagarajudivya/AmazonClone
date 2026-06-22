package com.amazonClone.amazon.service.impl;

import com.amazonClone.amazon.dto.request.LoginRequest;
import com.amazonClone.amazon.dto.request.RefreshTokenRequest;
import com.amazonClone.amazon.dto.request.RegisterRequest;
import com.amazonClone.amazon.dto.response.AuthResponse;
import com.amazonClone.amazon.entity.RefreshToken;
import com.amazonClone.amazon.entity.Role;
import com.amazonClone.amazon.entity.User;
import com.amazonClone.amazon.exception.TokenException;
import com.amazonClone.amazon.repository.UserRepository;
import com.amazonClone.amazon.security.JwtUtil;
import com.amazonClone.amazon.service.AuthService;
import com.amazonClone.amazon.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .build();

        userRepository.save(user);

        String accessToken = jwtUtil.generateAccessToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getEmail());

        return buildAuthResponse(user, accessToken, refreshToken.getToken());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new TokenException("User not found"));

        String accessToken = jwtUtil.generateAccessToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getEmail());

        return buildAuthResponse(user, accessToken, refreshToken.getToken());
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenService.findByToken(request.getRefreshToken());
        refreshTokenService.verifyExpiration(refreshToken);

        User user = refreshToken.getUser();
        String newAccessToken = jwtUtil.generateAccessToken(user);
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getEmail());

        return buildAuthResponse(user, newAccessToken, newRefreshToken.getToken());
    }

    @Override
    public void logout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new TokenException("User not found"));
        refreshTokenService.deleteByUser(user);
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }
}