package com.gamereviews.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gamereviews.dto.SignUpRequest;
import com.gamereviews.model.User;
import com.gamereviews.repository.UserRepository;
import com.gamereviews.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User createUser(SignUpRequest signUpRequest) {
        // Check if username already exists
        if (existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Username já está em uso!");
        }

        // Check if email already exists
        if (existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Email já está em uso!");
        }

        // Create new user
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
