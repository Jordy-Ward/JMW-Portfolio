package com.example.rsawebapp.controllers;

import com.example.rsawebapp.dto.RegisterLoginRequest;
import com.example.rsawebapp.models.User;
import com.example.rsawebapp.repositories.UserRepository;
import com.example.rsawebapp.utils.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/rsa")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwUtil;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody RegisterLoginRequest loginRequest) {
        Map<String, String> response = new HashMap<>();
        
        try {
            // Validate input
            if (loginRequest.getUsername() == null || loginRequest.getUsername().trim().isEmpty()) {
                response.put("error", "Username is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                response.put("error", "Password is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            User user = userRepository.findByUsername(loginRequest.getUsername().trim());
            
            if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                String token = jwUtil.generateToken(user.getUsername());
                response.put("token", token);
                response.put("message", "Login successful");
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Invalid username or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            response.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
