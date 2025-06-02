package com.gamereviews.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gamereviews.dto.LoginRequest;
import com.gamereviews.dto.LoginResponse;
import com.gamereviews.dto.SignUpRequest;
import com.gamereviews.model.User;

@Service
public class AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse authenticate(LoginRequest loginRequest) {
        User user = userService.findByEmail(loginRequest.getEmail());

        if (user == null) {
            throw new RuntimeException("Usuário não encontrado");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Senha incorreta");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(token, user);
    }

    public User register(SignUpRequest signUpRequest) {
        return userService.createUser(signUpRequest);
    }
}
