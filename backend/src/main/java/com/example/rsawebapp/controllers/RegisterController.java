package com.example.rsawebapp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.example.rsawebapp.dto.RegisterLoginRequest;
import com.example.rsawebapp.models.User;
import com.example.rsawebapp.repositories.UserRepository;

@RestController
@RequestMapping("/api/rsa/register")
public class RegisterController {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/registerUser")
    public String registerUser(@RequestBody RegisterLoginRequest registerRequest) {
        if (userRepository.findByUsername(registerRequest.getUsername()) != null) {
            return "Username already exists";
        }
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        userRepository.save(user);
        return "User registered successfully";
    }
    
}
