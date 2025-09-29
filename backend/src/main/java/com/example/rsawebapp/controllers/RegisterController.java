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
import java.security.KeyPairGenerator;
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
    public Map<String, String> registerUser(@RequestBody RegisterLoginRequest registerRequest) throws Exception {
        if (userRepository.findByUsername(registerRequest.getUsername()) != null) {
            Map<String, String> responseError = new HashMap<>();
            responseError.put("message", "Username already exsists");
            responseError.put("privateKey", null);
            return responseError;
        }

        //generate rsa key pair
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(2048);
        KeyPair keyPair = keyGen.genKeyPair();
        String publicKey = Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded());
        String privateKey = Base64.getEncoder().encodeToString(keyPair.getPrivate().getEncoded());

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPublicKey(publicKey);
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully. Save your private key securely.");
        response.put("privateKey", privateKey);
        return response;
        
    }
    
}
