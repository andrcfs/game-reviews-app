package com.gamereviews.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gamereviews.dto.LoginRequest;
import com.gamereviews.dto.LoginResponse;
import com.gamereviews.dto.SignUpRequest;
import com.gamereviews.model.User;
import com.gamereviews.service.AuthService;
import com.gamereviews.service.JwtUtil;
import com.gamereviews.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    // Endpoint de teste simples
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("User API is working!");
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        try {
            User user = userService.createUser(signUpRequest);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Usuário criado com sucesso: " + user.getUsername());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erro: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse loginResponse = authService.authenticate(loginRequest);
            return ResponseEntity.ok(loginResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Erro: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");

            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Token inválido");
            }

            String email = jwtUtil.getEmailFromToken(token);
            User user = userService.findByEmail(email);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Usuário não encontrado");
            }

            LoginResponse.UserDto userDto = new LoginResponse.UserDto(user);
            return ResponseEntity.ok(userDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Erro de autenticação: " + e.getMessage());
        }
    }
}
