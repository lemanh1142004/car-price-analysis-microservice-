package com.example.authservice.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.authservice.dto.AuthResponse;
import com.example.authservice.dto.LoginRequest;
import com.example.authservice.dto.RegisterRequest;
import com.example.authservice.dto.UserResponse;
import com.example.authservice.entity.User;
import com.example.authservice.repository.UserRepository;
import com.example.authservice.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Số điện thoại đã tồn tại");
        }

        User user = User.builder()
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role("USER")
                .status("active")
                .build();

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole()
        );

        return AuthResponse.builder()
                .message("Đăng ký thành công")
                .accessToken(token)
                .user(mapToUserResponse(savedUser))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không đúng"));

        boolean isMatch = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());

        if (!isMatch) {
            throw new RuntimeException("Email hoặc mật khẩu không đúng");
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole()
        );

        return AuthResponse.builder()
                .message("Đăng nhập thành công")
                .accessToken(token)
                .user(mapToUserResponse(user))
                .build();
    }

    public UserResponse getMe(User user) {
        return mapToUserResponse(user);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .phone(user.getPhone())
                .fullName(user.getFullName())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }
}