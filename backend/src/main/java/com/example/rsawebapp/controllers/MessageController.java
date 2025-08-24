package com.example.rsawebapp.controllers;

import com.example.rsawebapp.dto.SendMessageRequest;
import com.example.rsawebapp.models.Message;
import com.example.rsawebapp.models.User;
import com.example.rsawebapp.repositories.MessageRepository;
import com.example.rsawebapp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rsa/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    // Send a message (frontend handles encryption if needed)
    @PostMapping("/send")
    public String sendMessage(@RequestBody SendMessageRequest request, Authentication authentication) {
        Message message = new Message();
        message.setSender(authentication.getName());
        message.setRecipient(request.getRecipient());
        message.setEncrypted(request.isEncrypted());
        message.setContent(request.getContent());
        messageRepository.save(message);
        return "Message sent!";
    }

    // Get messages for logged in user (inbox)
    @GetMapping("/inbox")
    public List<Message> getInbox(Authentication authentication) {
        return messageRepository.findByRecipient(authentication.getName());
    }

    // Get messages sent by logged in user
    @GetMapping("/sent")
    public List<Message> getSent(Authentication authentication) {
        return messageRepository.findBySender(authentication.getName());
    }

    // Public key lookup
    @GetMapping("/public-key/{username}")
    public String getPublicKey(@PathVariable String username) {
        User user = userRepository.findByUsername(username);
        if (user != null && user.getPublicKey() != null) {
            return user.getPublicKey();
        } else {
            throw new RuntimeException("User or public key not found");
        }
    }
}
