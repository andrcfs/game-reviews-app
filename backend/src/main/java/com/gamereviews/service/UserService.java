package com.gamereviews.service;

import com.gamereviews.dto.SignUpRequest;
import com.gamereviews.model.User;

public interface UserService {
    User createUser(SignUpRequest signUpRequest);

    User findByUsername(String username);

    User findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
