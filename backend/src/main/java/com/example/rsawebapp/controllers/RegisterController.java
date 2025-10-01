package com.example.rsawebapp.controllers;

import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.rsawebapp.dto.RegisterLoginRequest;
import com.example.rsawebapp.models.User;
import com.example.rsawebapp.repositories.UserRepository;

import java.security.KeyPair;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/rsa/register")
public class RegisterController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/registerUser")
    public Map<String, String> registerUser(@RequestBody RegisterLoginRequest registerRequest) {
        Map<String, String> response = new HashMap<>();
        
        // Validate input
        if (registerRequest.getUsername() == null || registerRequest.getUsername().trim().isEmpty()) {
            response.put("error", "Username is required");
            return response;
        }
        
        if (registerRequest.getPassword() == null || registerRequest.getPassword().trim().isEmpty()) {
            response.put("error", "Password is required");
            return response;
        }
        
        if (registerRequest.getPassword().length() < 3) {
            response.put("error", "Password must be at least 3 characters long");
            return response;
        }
        
        // Check if username already exists
        if (userRepository.findByUsername(registerRequest.getUsername().trim()) != null) {
            response.put("error", "Username already exists");
            return response;
        }

        try {
            // Generate RSA key pair
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
            keyGen.initialize(2048);
            KeyPair keyPair = keyGen.genKeyPair();
            String publicKey = Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded());
            String privateKey = Base64.getEncoder().encodeToString(keyPair.getPrivate().getEncoded());

            // Create and save user
            User user = new User();
            user.setUsername(registerRequest.getUsername().trim());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setPublicKey(publicKey);
            userRepository.save(user);

            response.put("message", "User registered successfully. Save your private key securely.");
            response.put("privateKey", privateKey);
            return response;
            
        } catch (NoSuchAlgorithmException e) {
            response.put("error", "Failed to generate RSA keys: " + e.getMessage());
            return response;
        } catch (Exception e) {
            response.put("error", "Registration failed: " + e.getMessage());
            return response;
        }
    }
    
}
