package com.example.rsawebapp.controllers;

import com.example.rsawebapp.dto.RegisterLoginRequest;
import com.example.rsawebapp.models.User;
import com.example.rsawebapp.repositories.UserRepository;
import com.example.rsawebapp.utils.JwtUtil;

import javax.management.RuntimeErrorException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
    public String login(@RequestBody RegisterLoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());
        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return jwUtil.generateToken(user.getUsername());
        } else {
            throw new RuntimeException("Invalid username or password");
        }
    }
}
