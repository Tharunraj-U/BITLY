package com.bitly.URL_Backend.security.sign.controller;

import com.bitly.URL_Backend.model.User;
import com.bitly.URL_Backend.security.sign.dto.LoginRequest;
import com.bitly.URL_Backend.security.sign.dto.RegisterRequest;
import com.bitly.URL_Backend.security.sign.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        // Create a new user
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setUsername(registerRequest.getUsername());
        user.setRole("ROLE_USER");  // Set default role

        boolean isRegistered = userService.register(user);

        if (isRegistered) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("User " + user.getUsername() + " registered successfully.");
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("User registration failed.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> signInUser(@RequestBody LoginRequest loginRequest) {
        String token = userService.authenticate(loginRequest);

        if (token != null) {
            return ResponseEntity.ok("Login successful, token: " + token);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid credentials.");

    }
}
